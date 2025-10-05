import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    pipeline
)
from peft import PeftModel

BASE_MODEL = "meta-llama/Llama-2-7b-chat-hf"
MODEL = "./lora_uber_driver"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

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

# Optional torch.compile for speed
try:
    if torch.__version__.startswith("2"):
        print("Attempting torch.compile for extra speed (PyTorch 2.x)...")
        model.forward = torch.compile(model.forward)
except Exception as e:
    print(f"torch.compile skipped: {e}")

chat_pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto",
    return_full_text=False
)

history = []
MAX_EXCHANGES = 5

def build_prompt(hist, user_text):
    system = "You are a helpful assistant specialized for Uber drivers. Give concise practical tips."
    chat_lines = [f"System: {system}"]
    for h in hist:
        chat_lines.append(f"Human: {h['user']}")
        chat_lines.append(f"Assistant: {h['assistant']}")
    chat_lines.append(f"Human: {user_text}")
    chat_lines.append("Assistant:")
    return "\n".join(chat_lines)

print("💬 LLaMA-2 chat with LoRA fine-tuning ready. Type 'exit' to quit.\n")
while True:
    user = input("You: ").strip()
    if user.lower() in ("exit", "quit"):
        print("Bye!")
        break
    prompt = build_prompt(history, user)

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

    print(f"AI: {reply}\n")
    history.append({"user": user, "assistant": reply})

    if len(history) > MAX_EXCHANGES:
        history = history[-MAX_EXCHANGES:]
