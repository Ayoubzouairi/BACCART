/* أنماط العنوان */
.logo-b {
  color: #007bff;
  font-size: 1.2em;
}

.logo-s {
  color: #dc3545;
  font-size: 1.2em;
}

.logo-rest {
  color: gold;
}

/* أنماط عامة */
body {
  background-color: #121212;
  color: gold;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  padding: 2em;
  direction: rtl;
  text-align: center;
  transition: all 0.3s ease;
}

body.light-mode {
  background-color: #f5f5f5;
  color: #333;
}

/* تصميم حاوية الرهان */
.bet-amount-container {
  margin: 20px auto;
  padding: 15px;
  background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05));
  border-radius: 15px;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,215,0,0.3);
}

/* باقي أنماط CSS كما هي ... */
/* [يجب أن تضع هنا كل محتوى ملف الـ CSS السابق الذي أعطيته لك] */

/* إشعارات */
#notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: slideIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
  display: flex;
  align-items: center;
}

.notification-win {
  background-color: #28a745;
  border-left: 5px solid #1e7e34;
}

.notification-loss {
  background-color: #dc3545;
  border-left: 5px solid #a71d2a;
}

.notification-tie {
  background-color: #6c757d;
  border-left: 5px solid #495057;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
