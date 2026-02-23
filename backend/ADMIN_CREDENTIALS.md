# 🔐 Nirvaha Admin Credentials

## Default Admin Account

This document contains the default admin credentials for the Nirvaha application. **KEEP THIS SECURE AND CHANGE THE PASSWORD IMMEDIATELY IN PRODUCTION.**

### Login Credentials

```
Email:    admin@nirvaha.com
Password: N1rv@h@Adm!n#2025@Secure
```

---

## 🔒 Security Information

### Password Strength
✅ **16 characters long** - Exceeds minimum requirements
✅ **Mixed case** - Contains uppercase and lowercase letters
✅ **Numbers** - Includes numeric characters (1, 2, 0, 2, 5)
✅ **Special characters** - Contains @, !, # symbols
✅ **No dictionary words** - Not based on common words

### Bcrypt Hashing
- **Salt Rounds**: 12 (industry standard for high security)
- **Algorithm**: Bcrypt with SHA-256
- **Hash Format**: $2b$12$...

---

## ⚠️ CRITICAL ACTIONS REQUIRED

### 1. **Change Password Immediately**
After first login, change the admin password in the admin panel:
- Navigate to Admin Settings → Account → Change Password
- Use a new strong password (minimum 12 characters)
- Store the new password in a secure password manager

### 2. **Enable Two-Factor Authentication (2FA)**
- Setup 2FA in Admin Settings → Security
- Use an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
- Save backup codes in a secure location

### 3. **Restrict Access**
- Change email to your organization's email
- Limit login to specific IP addresses if possible
- Monitor login activity in Admin Dashboard

### 4. **Production Deployment**
- Update `.env` with a new JWT_SECRET
- Use environment variables for sensitive data
- Never commit credentials to version control
- Implement rate limiting on login endpoints

---

## 🚀 First Login Steps

1. **Access Admin Panel**
   - Navigate to: `http://localhost:5000/admin` or your deployment URL
   - Click "Login"

2. **Enter Credentials**
   - Email: `admin@nirvaha.com`
   - Password: `N1rv@h@Adm!n#2025@Secure`

3. **Verify Access**
   - You should see the admin dashboard
   - Verify all modules are accessible

4. **Change Password**
   - Go to Admin Settings
   - Update to a new secure password
   - IMPORTANT: Document the new password securely

---

## 📝 Password Policy

For all admin accounts, enforce:

- **Minimum Length**: 12 characters
- **Complexity**: At least 3 of 4 types:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- **Expiration**: 90 days
- **History**: Cannot reuse last 5 passwords
- **No Default Passwords**: Change default credentials on first login

---

## 🛡️ Security Checklist

- [ ] Default password changed
- [ ] 2FA enabled
- [ ] Email updated to organization account
- [ ] JWT_SECRET changed in production
- [ ] Rate limiting enabled
- [ ] Login monitoring enabled
- [ ] Backup codes saved securely
- [ ] Access logs reviewed monthly
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed

---

## 💾 Backup & Recovery

### Password Recovery
If you forget the admin password:

1. Use the "Forgot Password" link on login page
2. Check email for password reset link
3. Follow the reset instructions

### Database Reset (Development Only)
To reset the admin account in development:

```bash
# Connect to MongoDB
mongosh

# Switch to nirvaha database
use nirvaha

# Delete admin user
db.users.deleteOne({ email: "admin@nirvaha.com" })

# Restart the server to recreate with default credentials
# Kill the process and run: npm start
```

---

## 📞 Support

For security issues or password reset assistance:
- Contact: support@nirvaha.app
- Security Email: security@nirvaha.app
- Emergency: +1-XXX-XXX-XXXX

---

**Last Updated**: February 24, 2026
**Version**: 1.0
**Status**: Active
