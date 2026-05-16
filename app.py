import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- Configuration ---
# Set these in your .env file
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "info@muthugroups.com")


@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"}), 200

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/companies')
def companies():
    return render_template('companies.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Handle form submission
        # Check if it's JSON (from fetch) or standard form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form
        
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone', 'N/A')
        company = data.get('company', 'N/A')
        enquiry_type = data.get('enquiry_type', 'General Enquiry')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        try:
            # Prepare Email
            msg = MIMEMultipart()
            msg['From'] = SMTP_USERNAME
            msg['To'] = CONTACT_EMAIL
            msg['Subject'] = f"New Contact Enquiry from {name} - {enquiry_type}"

            body = f"""
            New Contact Enquiry from Muthu Groups Website:
            
            Name: {name}
            Email: {email}
            Phone: {phone}
            Company: {company}
            Subject: {enquiry_type}
            
            Message:
            {message}
            """
            msg.attach(MIMEText(body, 'plain'))

            # Send Email
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.set_debuglevel(0) # Set to 1 for debugging
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()

            return jsonify({"success": True, "message": "Thank you! Your message has been sent."})
        except Exception as e:
            print(f"Error sending email: {e}")
            return jsonify({"success": False, "message": "Failed to send email. Please try again later."}), 500

    return render_template('contact.html')

if __name__ == '__main__':
    # Ensure port is an integer
    app.run(host='0.0.0.0', debug=True)
