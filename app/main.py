import os
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Supabase Bookmark Manager")

# Supabase Config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables are required.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

templates = Jinja2Templates(directory="templates")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    try:
        response = supabase.table("bookmarks").select("*").order("created_at", desc=True).execute()
        bookmarks = response.data
    except Exception as e:
        bookmarks = []
        print(f"Error fetching bookmarks: {e}")
    
    return templates.TemplateResponse("index.html", {"request": request, "bookmarks": bookmarks})

@app.post("/bookmarks")
async def add_bookmark(url: str = Form(...), title: str = Form(...)):
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        supabase.table("bookmarks").insert({"url": url, "title": title}).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return RedirectResponse(url="/", status_code=303)

@app.post("/bookmarks/delete/{bookmark_id}")
async def delete_bookmark(bookmark_id: int):
    try:
        supabase.table("bookmarks").delete().eq("id", bookmark_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return RedirectResponse(url="/", status_code=303)
