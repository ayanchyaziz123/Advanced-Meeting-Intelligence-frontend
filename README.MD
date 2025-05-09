# 🚀 NGI-Meeting-Transcription-Summarization-Platform   

NGI Meeting Transcription & Summarization Platform is a lightweight AI-powered SaaS tool designed for private associations to enhance meeting productivity by transcribing and summarizing recordings (Zoom, Teams, in-person audio), generating structured notes with agenda items, decisions, and action items, supporting multiple languages and platforms.

---

## Prerequisites

- Python 3.8+
- Git

---

## ⚙️ Full Setup Commands

```bash
# 1. Clone the repo
git clone https://github.com/ayanchyaziz123/NGI-Meeting-Transcription-Summarization-Platform.git
cd NGI-Meeting-Transcription-Summarization-Platform.

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate          

# 3. Install dependencies
pip install fastapi uvicorn joblib scikit-learn

# 4. (Optional) Freeze dependencies
pip freeze > requirements.txt

# 5. Create folder structure (if not already present)
mkdir -p app/routers app/services app/ml

# 6. Create main file
touch main.py
