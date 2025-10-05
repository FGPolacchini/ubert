import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    pipeline
)
from peft import PeftModel

# === Configuration ===
BASE_MODEL = "meta-llama/Llama-2-7b-chat-hf"
MODEL = "./lora_uber_driver"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

print("🔧 Loading model and tokenizer (this may take a minute)...")

# === Load tokenizer ===
tokenizer = AutoTokenizer.from_pretrained(MODEL, use_fast=True)

# === Load base model ===
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)

# === Apply LoRA adapters ===
model = PeftModel.from_pretrained(base_model, MODEL)
model.eval()

# === Optional torch.compile for PyTorch 2.x ===
try:
    if torch.__version__.startswith("2"):
        print("⚡ Compiling model forward for extra speed...")
        model.forward = torch.compile(model.forward)
except Exception as e:
    print(f"torch.compile skipped: {e}")

# === Create text generation pipeline ===
chat_pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto",
    return_full_text=False
)

print("✅ Model is loaded and ready for chat.\n")

# === Chat memory ===
history = []
MAX_EXCHANGES = 5


def build_prompt(hist, user_text):
    """Builds a prompt that includes short conversation memory."""
    system = (
        "You are a helpful assistant specialized for Uber drivers. "
        "Give concise, practical, friendly tips based on the user's question."
    )
    chat_lines = [f"System: {system}"]
    for h in hist:
        chat_lines.append(f"Human: {h['user']}")
        chat_lines.append(f"Assistant: {h['assistant']}")
    chat_lines.append(f"Human: {user_text}")
    chat_lines.append("Assistant:")
    return "\n".join(chat_lines)


def chat_with_model(user_input: str) -> str:
    """
    Generates a response using the LoRA-tuned LLaMA model.
    Keeps context from the last few exchanges.
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

    # Store in short-term memory
    history.append({"user": user_input, "assistant": reply})
    if len(history) > MAX_EXCHANGES:
        history = history[-MAX_EXCHANGES:]

    return reply

if __name__ == "__main__":
    print("💬 Chat service is running. Type a message or 'exit' to stop.\n")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("exit", "quit"):
            print("Bye!")
            break
        response = chat_with_model(user_input)
        print(f"AI: {response}\n")

