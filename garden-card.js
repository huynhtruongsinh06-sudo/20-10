(() => {
  'use strict';

  const STORAGE_KEY = 'flower.garden.greeting.20-10.v2';
  const card = document.getElementById('wishCard');
  const reading = document.getElementById('cardReading');
  const editor = document.getElementById('cardEditor');
  const editButton = document.getElementById('editCard');
  const status = document.getElementById('cardStatus');
  const recipient = document.getElementById('cardRecipient');
  const title = document.getElementById('cardTitle');
  const message = document.getElementById('cardMessage');
  const signature = document.getElementById('cardSignature');
  const flowerBadge = document.getElementById('cardFlowerBadge');
  const copyButton = document.getElementById('btnCopyWish');
  const toast = document.getElementById('toastNotification');

  const inputs = {
    recipient: document.getElementById('recipientInput'),
    title: document.getElementById('titleInput'),
    message: document.getElementById('messageInput'),
    signature: document.getElementById('signatureInput')
  };

  let currentWishText = '';
  let currentFlower = null;

  function showToast(text, duration = 2500) {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, duration);
  }

  function renderGreeting(rec, tit, msg, sig) {
    if (recipient) recipient.textContent = rec;
    if (title) title.textContent = tit;
    if (signature) signature.textContent = sig;
    if (message) {
      message.replaceChildren(...msg.split(/\n\s*\n/).map(text => {
        const paragraph = document.createElement('p');
        paragraph.className = 'message';
        paragraph.textContent = text;
        return paragraph;
      }));
    }
  }

  function showReading() {
    if (editor) editor.hidden = true;
    if (reading) reading.hidden = false;
    card.setAttribute('aria-labelledby', 'cardTitle');
    card.scrollTop = 0;
  }

  if (editButton && editor) {
    editButton.addEventListener('click', () => {
      inputs.recipient.value = recipient.textContent;
      inputs.title.value = title.textContent;
      inputs.message.value = [...message.querySelectorAll('p')].map(p => p.textContent).join('\n\n');
      inputs.signature.value = signature.textContent;
      reading.hidden = true;
      editor.hidden = false;
      if (status) status.textContent = '';
      card.setAttribute('aria-labelledby', 'editorTitle');
      card.scrollTop = 0;
      inputs.recipient.focus({ preventScroll: true });
    });
  }

  const cancelEditBtn = document.getElementById('cancelEdit');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      showReading();
      if (editButton) editButton.focus({ preventScroll: true });
    });
  }

  card.addEventListener('close', () => {
    showReading();
    if (status) status.textContent = '';
  });

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const fullText = `🌸 ${title.textContent}\n\nGửi ${recipient.textContent},\n${[...message.querySelectorAll('p')].map(p => p.textContent).join('\n\n')}\n\n${signature.textContent}`;
      try {
        await navigator.clipboard.writeText(fullText);
        showToast('Đã sao chép lời chúc vào khay nhớ tạm! 🌸');
      } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Đã sao chép lời chúc! 🌸');
      }
    });
  }

  if (editor) {
    editor.addEventListener('submit', event => {
      event.preventDefault();
      const rec = inputs.recipient.value.trim() || 'bạn thương mến';
      const tit = inputs.title.value.trim() || 'Chúc mừng ngày 20/10!';
      const msg = inputs.message.value.trim() || '';
      const sig = inputs.signature.value.trim() || 'Thương mến ♡';

      renderGreeting(rec, tit, msg, sig);
      showReading();
      showToast('Đã cập nhật lời chúc! ✨');
    });
  }

  window.GardenCardManager = {
    showFlowerWish(flower, guestName, flowerName) {
      currentFlower = flower;
      const cleanName = (guestName || '').trim() || 'bạn';
      
      // Lấy ngẫu nhiên 1 trong 20 câu chúc và thay "bạn" thành tên người dùng
      const wishMsg = window.FlowerWishes 
        ? window.FlowerWishes.getRandomWish(cleanName) 
        : `Chúc ${cleanName} ngày 20/10 ngập tràn niềm vui và hạnh phúc!`;
        
      const cardTitleText = `Mong những điều tuyệt vời nhất luôn bên ${cleanName}`;
      const sigText = `Gửi ${cleanName} vạn đóa yêu thương ♡`;

      if (flowerBadge) {
        const idLabel = flower.isHero ? 'Trái tim khu vườn' : `Đóa hoa #${flower.id}`;
        flowerBadge.textContent = `🌸 ${flowerName} · ${idLabel}`;
      }

      renderGreeting(cleanName, cardTitleText, wishMsg, sigText);
      showReading();
      if (!card.open) {
        card.showModal();
      }
    },
    closeCard() {
      if (card.open) card.close();
    },
    showToast
  };
})();
