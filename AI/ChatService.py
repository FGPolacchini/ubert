import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    pipeline
)
from peft import PeftModel

# --- Configuration ---
BASE_MODEL = "meta-llama/Llama-2-7b-chat-hf"
MODEL = "./lora_uber_driver"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

# --- Load model and tokenizer once ---
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL, use_fast=True)

print("Loading base model (this may take a minute)...")
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)

print("Applying LoRA adapters...")
model = PeftModel.from_pretrained(base_model, MODEL)
model.eval()

# Optional: torch.compile for extra speed (only forward)
try:
    if torch.__version__.startswith("2"):
        print("Attempting torch.compile for extra speed (PyTorch 2.x)...")
        model.forward = torch.compile(model.forward)
except Exception as e:
    print(f"torch.compile skipped: {e}")

# --- Create generation pipeline ---
chat_pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto",
    return_full_text=False
)

# --- Chat Memory ---
history = []
MAX_EXCHANGES = 5


def build_prompt(hist, user_text):
    """Builds the prompt using chat history."""
    system = "You are a helpful assistant specialized for Uber drivers. Give concise practical tips."
    chat_lines = [f"System: {system}"]
    for h in hist:
        chat_lines.append(f"Human: {h['user']}")
        chat_lines.append(f"Assistant: {h['assistant']}")
    chat_lines.append(f"Human: {user_text}")
    chat_lines.append("Assistant:")
    return "\n".join(chat_lines)


def chat_with_model(user_input: str) -> str:
    """
    Generate a model response from user input.
    Keeps short-term history and returns only text.
    """
    global history

    if not user_input.strip():
        return "Please provide a valid input."

    prompt = build_prompt(history, user_input)

    gen = chat_pipe(
        prompt,
        max_new_tokens=300,
        do_sample=True,
        temperature=0.6,
        top_p=0.85,
        repetition_penalty=1.05,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id
    )

    reply = gen[0]["generated_text"].strip()

    # Update conversation history
    history.append({"user": user_input, "assistant": reply})
    if len(history) > MAX_EXCHANGES:
        history = history[-MAX_EXCHANGES:]

    return reply
