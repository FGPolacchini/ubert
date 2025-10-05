import pandas as pd
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

# -----------------------------
# Model repo (Zephyr)
# -----------------------------
repo_id = "HuggingFaceH4/zephyr-7b-beta"  # Zephyr 7B Beta

# Quantization config (for smaller VRAM usage)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

# -----------------------------
# Load Tokenizer & Model
# -----------------------------
tokenizer = AutoTokenizer.from_pretrained(repo_id)
model = AutoModelForCausalLM.from_pretrained(
    repo_id,
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.float16
)

# -----------------------------
# Load Excel data
# -----------------------------
df = pd.read_excel("HEATMAP.xlsx")

# -----------------------------
# Tip generation function
# -----------------------------
def generate_tip(row):
    prompt = f"""
You are an assistant for Uber and Uber Eats drivers.
Date: {row['date']}
City ID: {row['city_id']}
Weather: {row['weather']}

Task:
- If the weather is good (sunny, clear, mild), encourage the driver to work.
- If the weather is bad (heavy rain, snow, storm), give a cautionary but supportive tip.

Respond in one clear sentence starting with: "Tip:"
"""

    # Prepare input
    input_ids = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.inference_mode():
        output_ids = model.generate(
            **input_ids,
            max_new_tokens=50,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id
        )

    # Decode
    tip = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    # Extract only the tip
    if "Tip:" in tip:
        return tip.split("Tip:")[-1].strip()
    return tip.strip()

# -----------------------------
# Apply tip generation
# -----------------------------
df['tip'] = df.apply(generate_tip, axis=1)

# Save output
df.to_excel("table_with_tips.xlsx", index=False)
print("✅ Tips generated and saved successfully!")
