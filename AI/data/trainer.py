from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset
from peft import LoraConfig, get_peft_model

# Load dataset
dataset = load_dataset("json", data_files="tables/classification_dataset.jsonl")

# Load Zephyr
model_name = "openai/zephyr-7b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Apply LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj","v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# Training arguments
training_args = TrainingArguments(
    output_dir="./zephyr-classifier",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=16,
    learning_rate=2e-4,
    num_train_epochs=3,
    fp16=True
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
)
trainer.train()
