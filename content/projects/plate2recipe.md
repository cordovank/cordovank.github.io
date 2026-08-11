---
id: project_plate2recipe
label: Plate2Recipe
section: projects
tags: [multimodal, pytorch, vit, gpt-2, lstm, deep learning, computer vision, nlp, error analysis]
---
Plate2Recipe is a two-stage multimodal project that maps a food image to a generated recipe. The first stage uses a vision model to identify likely ingredients from the image, and the second stage uses sequence generation to produce a recipe conditioned on those ingredient predictions. The implementation explored a ViT-based ingredient recognition stage paired with GPT-2 or LSTM-style recipe generation.

The project is notable not just because it combines computer vision and NLP, but because it highlights careful evaluation. A key finding was that a smaller 10k-sample run with better tuning produced more useful results than a larger 100k-sample run with lower training loss. That result reinforced an important modeling lesson: lower loss does not always mean better real output quality.

Built with PyTorch, Plate2Recipe demonstrates multimodal reasoning, experiment-driven iteration, and end-to-end error analysis rather than stopping at model training alone.