type ReminderOptions = {
  email?: string;
  phone?: string;
  message: string;
};

export const mockSendReminder = ({ email, phone, message }: ReminderOptions) => {
  console.log("📤 Sending Reminder:");
  if (email) console.log(`✉️ Email to ${email}: ${message}`);
  if (phone) console.log(`📱 SMS to ${phone}: ${message}`);
};
