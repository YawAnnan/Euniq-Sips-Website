/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Check if password field was changed
  const original = e.record.original();
  const currentPassword = e.record.get("password");
  const originalPassword = original.get("password");
  
  // Only send email if password actually changed
  if (currentPassword && originalPassword && currentPassword !== originalPassword) {
    const adminEmail = e.record.get("email");
    const adminName = e.record.get("name");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: adminEmail }],
      subject: "Your Password Has Been Reset",
      html: "<h2>Password Reset Confirmation</h2>" +
            "<p>Hi " + adminName + ",</p>" +
            "<p>Your admin account password has been successfully reset.</p>" +
            "<p>If you did not request this change, please contact your system administrator immediately.</p>" +
            "<p><strong>Security Tip:</strong> Never share your password with anyone.</p>" +
            "<hr>" +
            "<p><small>This is an automated message from your admin panel.</small></p>"
    });
    
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "admin_users");