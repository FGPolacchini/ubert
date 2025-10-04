# chat_llama2.py
import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    pipeline
)

MODEL = "meta-llama/Llama-2-7b-chat-hf"   # Hugging Face repo

# 1) Quantization config (4-bit, nf4 works well)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,  # use float16 for compute
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL, use_fast=True)

print("Loading model (this may take a minute)...")
model = AutoModelForCausalLM.from_pretrained(
    MODEL,
    quantization_config=bnb_config,
    device_map="auto",         # auto shard across gpu/cpu
    trust_remote_code=True     # sometimes required for chat HF implementations
)

# optional: compile for further speedups (requires PyTorch 2.0+)
try:
    if torch.__version__.startswith("2"):
        print("Attempting torch.compile for extra speed (PyTorch 2.x)...")
        model = torch.compile(model)
except Exception as e:
    print("torch.compile skipped:", e)

# Create pipeline (turn off returning full text to avoid prompt repeats)
chat_pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto",
    return_full_text=False
)

# Chat loop (short history kept)
history = []
MAX_EXCHANGES = 5   # keep last 5 exchanges to limit context length

def build_prompt(history, user_text):
    # Simple chat format suitable for Llama-2-chat-hf style models
    # Adjust with your preferred system / assistant persona
    system = "You are a helpful assistant specialized for Uber drivers. Give concise practical tips."
    chat_lines = [f"System: {system}"]
    for h in history:
        chat_lines.append(f"Human: {h['user']}")
        chat_lines.append(f"Assistant: {h['assistant']}")
    chat_lines.append(f"Human: {user_text}")
    chat_lines.append("Assistant:")
    return "\n".join(chat_lines)

print("💬 LLaMA-2 chat ready. Type 'exit' to quit.\n")
while True:
    user = input("You: ").strip()
    if user.lower() in ("exit", "quit"):
        print("Bye!")
        break
    prompt = build_prompt(history, user)

    # Generation parameters tuned for speed & reasonable quality
    gen = chat_pipe(
        prompt,
        max_new_tokens=120,
        do_sample=True,
        temperature=0.6,
        top_p=0.85,
        repetition_penalty=1.05,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id
    )

    # pipeline with return_full_text=False returns the generated suffix
    reply = gen[0]["generated_text"].strip()

    # Print and append to history
    print(f"AI: {reply}\n")
    history.append({"user": user, "assistant": reply})

    # Trim history
    if len(history) > MAX_EXCHANGES:
        history = history[-MAX_EXCHANGES:]
