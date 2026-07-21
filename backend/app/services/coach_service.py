import logging
from typing import Dict, List, Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are JobPilot AI, an elite, highly experienced Career Coach, Principal Staff Engineer, and Tech Recruiter.
Your goal is to provide highly specific, actionable, and structured advice to help the user advance their career, pass interviews, negotiate salary, and close skill gaps.

Follow these strict rules:
1. NEVER give generic advice. Always use specific numbers, frameworks, and modern technologies.
2. Structure your answers beautifully using Markdown (bolding, lists, tables).
3. If the user asks about salary negotiation, provide an exact script they can copy-paste, and anchor the salary high.
4. If the user asks about skill gaps or roadmaps, provide a step-by-step week-by-week plan mentioning specific modern tools (e.g., instead of "learn databases", say "learn PostgreSQL indexing and Redis caching").
5. If the user provides context about their current skills, incorporate them deeply into your advice.

When you don't know the user's specific role or skills, ask them directly to provide that context.
"""

def get_career_response(
    message: str,
    history: Optional[List[Dict]] = None,
    resume_skills: Optional[List[str]] = None,
    desired_role: Optional[str] = None,
) -> str:
    """
    Generate a context-aware career coaching response using Groq's Llama models via LangChain.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "mock-key":
        return (
            "🚨 **Groq API Key Not Configured**\n\n"
            "This feature requires a real Groq API key to function as a true LLM-powered coach.\n\n"
            "Please add `GROQ_API_KEY=your_key_here` to your `.env` file in the backend directory and restart the server to chat with the real AI."
        )

    try:
        # Initialize the LLM
        llm = ChatGroq(
            model="llama-3.3-70b-versatile", 
            temperature=0.7, 
            api_key=settings.GROQ_API_KEY
        )
        
        # Build context
        context_msg = ""
        if resume_skills:
            context_msg += f"The user's current extracted skills are: {', '.join(resume_skills[:20])}.\n"
        if desired_role:
            context_msg += f"The user's target role is: {desired_role}.\n"
            
        final_system_prompt = SYSTEM_PROMPT
        if context_msg:
            final_system_prompt += f"\n\nContext about the user:\n{context_msg}"

        # Convert history
        langchain_history = []
        if history:
            for msg in history[-10:]: # Keep last 10 messages for context window
                role = msg.get("role")
                content = msg.get("content", "")
                if role == "user":
                    langchain_history.append(HumanMessage(content=content))
                elif role == "assistant":
                    langchain_history.append(AIMessage(content=content))

        langchain_history.append(HumanMessage(content=message))

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=final_system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ])

        chain = prompt | llm
        
        response = chain.invoke({"messages": langchain_history})
        return response.content

    except Exception as e:
        logger.error(f"Error calling Groq API in Career Coach: {e}")
        return f"I'm having trouble connecting to AI. Error details: {str(e)}\n\nPlease double check your GROQ_API_KEY in Render."
