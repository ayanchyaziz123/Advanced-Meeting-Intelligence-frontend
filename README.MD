# 🚀 FastAPI Backend (with ML Support)

This is a lightweight FastAPI backend with optional machine learning integration. It uses a clean MVC-style structure for scalability and maintainability.

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
