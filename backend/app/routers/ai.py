import os

from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel

router = APIRouter()


def get_client() -> AsyncOpenAI:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="OpenAI API key not configured. Set the OPENAI_API_KEY environment variable.",
        )
    return AsyncOpenAI(api_key=api_key)


class ReportRequest(BaseModel):
    topic: str
    report_type: str = "general"
    length: str = "medium"
    additional_instructions: str = ""


class CodeRequest(BaseModel):
    description: str
    language: str = "python"
    additional_instructions: str = ""


class EmailRequest(BaseModel):
    purpose: str
    tone: str = "professional"
    recipient: str = ""
    additional_instructions: str = ""


class DebugRequest(BaseModel):
    code: str
    error_message: str = ""
    language: str = "python"


class FormRequest(BaseModel):
    title: str
    description: str = ""
    num_questions: int = 5
    form_type: str = "survey"


class ChatRequest(BaseModel):
    message: str
    context: str = ""


@router.post("/generate-report")
async def generate_report(request: ReportRequest):
    client = get_client()

    length_guide = {
        "short": "about 300 words",
        "medium": "about 800 words",
        "long": "about 1500 words",
    }

    prompt = f"""Write a {request.report_type} report on the topic: "{request.topic}".

The report should be {length_guide.get(request.length, 'about 800 words')} long.
Include proper headings, sections, and formatting using Markdown.
Include an executive summary, introduction, main body with analysis, and conclusion.
{f'Additional instructions: {request.additional_instructions}' if request.additional_instructions else ''}

Format the report professionally with:
- Title
- Executive Summary
- Table of Contents
- Introduction
- Main Body (with sub-sections)
- Conclusion
- References (if applicable)"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert report writer. Write detailed, well-structured, professional reports.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=4000,
        temperature=0.7,
    )

    return {
        "content": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }


@router.post("/generate-code")
async def generate_code(request: CodeRequest):
    client = get_client()

    prompt = f"""Write clean, production-ready {request.language} code for the following:

{request.description}

{f'Additional instructions: {request.additional_instructions}' if request.additional_instructions else ''}

Requirements:
- Write clean, well-commented code
- Follow best practices for {request.language}
- Include error handling
- Add type hints where applicable
- Include a brief explanation of the code

Format your response as:
1. Brief explanation
2. The code in a code block
3. Usage example"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"You are an expert {request.language} developer. Write clean, efficient, production-ready code.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=4000,
        temperature=0.3,
    )

    return {
        "content": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }


@router.post("/compose-email")
async def compose_email(request: EmailRequest):
    client = get_client()

    prompt = f"""Compose a {request.tone} email for the following purpose:

{request.purpose}

{f'Recipient: {request.recipient}' if request.recipient else ''}
{f'Additional instructions: {request.additional_instructions}' if request.additional_instructions else ''}

Include:
- Subject line
- Greeting
- Body
- Professional closing
- Signature placeholder"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert email writer. Write clear, concise, and professional emails.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=2000,
        temperature=0.5,
    )

    return {
        "content": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }


@router.post("/debug-code")
async def debug_code(request: DebugRequest):
    client = get_client()

    prompt = f"""Debug the following {request.language} code:

```{request.language}
{request.code}
```

{f'Error message: {request.error_message}' if request.error_message else 'Find and fix any bugs or issues.'}

Provide:
1. **Issue Identified**: What's wrong with the code
2. **Root Cause**: Why the error occurs
3. **Fixed Code**: The corrected code
4. **Explanation**: What was changed and why
5. **Prevention Tips**: How to avoid similar issues"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert debugger and code reviewer. Identify bugs, explain issues clearly, and provide fixed code.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=4000,
        temperature=0.2,
    )

    return {
        "content": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }


@router.post("/generate-form")
async def generate_form(request: FormRequest):
    client = get_client()

    prompt = f"""Create a {request.form_type} form with the following details:

Title: {request.title}
{f'Description: {request.description}' if request.description else ''}
Number of questions: {request.num_questions}

Return the form as a JSON object with this structure:
{{
    "title": "Form Title",
    "description": "Form description",
    "questions": [
        {{
            "id": 1,
            "type": "multiple_choice|text|checkbox|dropdown|rating|date",
            "question": "Question text",
            "required": true/false,
            "options": ["Option 1", "Option 2"] // only for multiple_choice, checkbox, dropdown
        }}
    ]
}}

Make the questions relevant, well-worded, and varied in type.
Return ONLY the JSON, no other text."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a form design expert. Create well-structured forms with clear, relevant questions. Return only valid JSON.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=3000,
        temperature=0.5,
        response_format={"type": "json_object"},
    )

    import json

    try:
        form_data = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        form_data = {"raw": response.choices[0].message.content}

    return {
        "content": form_data,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }


@router.post("/chat")
async def chat(request: ChatRequest):
    client = get_client()

    messages = [
        {
            "role": "system",
            "content": """You are a helpful AI assistant integrated into a productivity app. 
You can help with:
- Writing reports and documents
- Generating and debugging code
- Composing emails
- Creating presentations
- Data analysis
- General questions and tasks

Be helpful, concise, and professional. Use Markdown formatting for clarity.""",
        },
    ]

    if request.context:
        messages.append({"role": "system", "content": f"Context: {request.context}"})

    messages.append({"role": "user", "content": request.message})

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=4000,
        temperature=0.7,
    )

    return {
        "content": response.choices[0].message.content,
        "tokens_used": response.usage.total_tokens if response.usage else 0,
    }
