import os

from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types


chatbot_bp = Blueprint("chatbot", __name__)


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ==========================================
# AI INSTRUCTIONS
# ==========================================

SYSTEM_INSTRUCTIONS = """
You are AgroFarming AI Assistant.

You are an intelligent assistant for Indian farmers and users.

You can answer questions about:

- Agriculture
- Crops
- Seeds
- Fertilizers
- Pesticides
- Crop diseases
- Soil
- Irrigation
- Farming techniques
- Weather
- Government agricultural schemes
- Crop prices
- Market information
- Farming technology
- General questions

LANGUAGE RULES:

1. If the user asks in English, answer in English.
2. If the user asks in Hindi, answer in Hindi.
3. If the user uses Hinglish, answer naturally in Hinglish.
4. Do not unnecessarily translate Hindi questions into English.
5. Keep the answer easy to understand.

REAL-TIME INFORMATION:

Use Google Search when the question requires current information,
such as:

- Today's weather
- Current weather
- Current crop prices
- Current mandi prices
- Latest government schemes
- Recent agricultural news
- Latest farming information
- Current market information
- Recent events

Do not invent current information.

If reliable information cannot be found, clearly say so.

AGRICULTURE:

Prefer Indian agricultural context when relevant.

When giving farming recommendations, consider:
- crop
- growth stage
- soil
- weather
- location
- irrigation
- disease/pest condition

Do not claim that you physically inspected a farm, crop, or soil.

Answer the user's actual question directly.

ANSWER STYLE:

Give a complete answer to the user's question.
Do not stop the answer halfway.
Keep answers concise but complete.
Use simple paragraphs and short numbered points when useful.
Do not use Markdown symbols such as *, #, -, _, or backticks.
Do not use decorative symbols.
Do not repeat the user's question.
Answer only what is relevant to the user's question.
"""


# ==========================================
# CHAT API
# ==========================================

@chatbot_bp.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        message = data.get("message", "").strip()
        history = data.get("history", [])

        if not message:

            return jsonify({
                "success": False,
                "error": "Message is required."
            }), 400


        # ==================================
        # BUILD CONVERSATION
        # ==================================

        conversation = []

        for item in history:

            role = item.get("role")
            content = item.get("content")

            if role not in ["user", "assistant"]:
                continue

            if not content:
                continue

            # Gemini uses "model" instead of "assistant"
            gemini_role = (
                "model"
                if role == "assistant"
                else "user"
            )

            conversation.append(
                types.Content(
                    role=gemini_role,
                    parts=[
                        types.Part.from_text(
                            text=content
                        )
                    ]
                )
            )


        # Add current question

        conversation.append(
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=message
                    )
                ]
            )
        )


        # ==================================
        # GEMINI CONFIG
        # ==================================

        config = types.GenerateContentConfig(

            system_instruction=SYSTEM_INSTRUCTIONS,

            temperature=0.3,

            max_output_tokens=4000
        )


        # ==================================
        # GEMINI REQUEST
        # ==================================

        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=conversation,

            config=config
        )


        answer = response.text


        # ==================================
        # RESPONSE
        # ==================================

        return jsonify({

            "success": True,

            "answer": answer

        })


    except Exception as e:

        print(
            "CHATBOT ERROR:",
            repr(e)
        )

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500