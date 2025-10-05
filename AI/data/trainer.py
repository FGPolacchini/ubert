import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling, BitsAndBytesConfig
from datasets import load_dataset
from peft import LoraConfig, get_peft_model

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-beta")

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

# Model (auto offload)
model = AutoModelForCausalLM.from_pretrained(
    "HuggingFaceH4/zephyr-7b-beta",
    quantization_config=bnb_config,
    device_map="auto"
)

# Dataset
dataset = load_dataset("json", data_files="tables/classification_dataset.jsonl")


def tokenize(batch):
    # batch["input"] and batch["output"] are lists of strings
    texts = [inp + " " + out for inp, out in zip(batch["input"], batch["output"])]

    tokens = tokenizer(
        texts,
        truncation=True,
        max_length=512,
        padding="max_length"
    )
    # labels must match input_ids
    tokens["labels"] = tokens["input_ids"].copy()
    return tokens


tokenized_dataset = dataset.map(tokenize, batched=True)

# Data collator
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# LoRA config
lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj","v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# Training args
training_args = TrainingArguments(
    output_dir="./zephyr-classifier",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=32,
    learning_rate=2e-4,
    num_train_epochs=3,
    fp16=True
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    data_collator=data_collator
)

trainer.train()
