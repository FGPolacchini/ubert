from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from peft import PeftModel

# Base model
base_model_name = "HuggingFaceH4/zephyr-7b-beta"
tokenizer = AutoTokenizer.from_pretrained(base_model_name)
model = AutoModelForCausalLM.from_pretrained(base_model_name, torch_dtype="auto")

# Load trained LoRA weights
model = PeftModel.from_pretrained(model, "./zephyr-classifier/checkpoint-21")

# Create a text generation pipeline
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Run inference
result = pipe("city_id: 3, day_of_week: 3, hour: 20")[0]["generated_text"]
print(result)
