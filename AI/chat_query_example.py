import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import PeftModel

base_model_name = "meta-llama/Llama-2-7b-chat-hf"
lora_model_path = "./lora_uber_driver"

tokenizer = AutoTokenizer.from_pretrained(base_model_name)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_name,
    device_map="auto",
    quantization_config=bnb_config
)

model = PeftModel.from_pretrained(base_model, lora_model_path, device_map="auto")

model.eval()

# oddly specific question that matches the one from the responses.json to check if it actually learnt something
prompt = "Which areas consistently perform above the dataset mean of $3.46?"

inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

with torch.no_grad():
    output_ids = model.generate(
        **inputs,
        max_new_tokens=150,
        do_sample=True,
        temperature=0.7,
        top_p=0.85
    )

generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
print("\n🚗 Uber Copilot says:\n")
print(generated_text)
