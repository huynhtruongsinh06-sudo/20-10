/**
 * 20 lời chúc ngày Phụ nữ Việt Nam 20/10 ý nghĩa.
 * Khi hiển thị sẽ thay thế từ "bạn" / "Bạn" bằng tên người dùng nhập lúc đầu.
 */
(() => {
  'use strict';

  const WISHES_20 = [
    "Nhân ngày Phụ nữ Việt Nam 20/10, chúc {name} luôn xinh đẹp, tự tin và rạng rỡ. Mong mỗi ngày trôi qua đều mang đến cho {name} thật nhiều niềm vui, yêu thương và những điều tốt đẹp nhất.",
    "Chúc {name} một ngày 20/10 ngập tràn hoa, quà và những lời yêu thương chân thành. Mong nụ cười luôn nở trên môi và hạnh phúc luôn đồng hành cùng {name} trên mọi chặng đường.",
    "Nhân ngày 20/10, chúc {name} - một nửa xinh đẹp của thế giới luôn mạnh mẽ để theo đuổi ước mơ, dịu dàng để cảm nhận yêu thương và bình an trong từng khoảnh khắc của cuộc sống.",
    "Chúc {name} không chỉ có một ngày 20/10 thật đặc biệt, mà cả 365 ngày trong năm đều được trân trọng, yêu thương và sống theo cách khiến mình hạnh phúc nhất.",
    "Mong rằng mọi cố gắng của {name} đều được ghi nhận, mọi ước mơ đều dần trở thành hiện thực và mọi yêu thương {name} trao đi đều được đáp lại bằng sự chân thành. Chúc mừng ngày 20/10!",
    "Chúc {name} luôn là phiên bản tuyệt vời nhất của chính mình: xinh đẹp theo cách riêng, bản lĩnh trước thử thách và đủ dịu dàng để yêu thương bản thân mỗi ngày.",
    "Ngày 20/10, chúc {name} luôn được bao quanh bởi những người chân thành, được làm điều mình yêu thích và tìm thấy niềm vui trong cả những điều giản dị nhất.",
    "Cảm ơn {name} vì đã mang đến cho cuộc đời này sự ấm áp, bao dung và những sắc màu thật đẹp. Chúc {name} một ngày 20/10 trọn vẹn yêu thương và hạnh phúc.",
    "Chúc {name} luôn giữ được ánh sáng trong đôi mắt, nụ cười trên môi và niềm tin trong trái tim. Mong cuộc sống sẽ dịu dàng với {name} như cách {name} vẫn luôn dịu dàng với mọi người.",
    "Nhân ngày Phụ nữ Việt Nam, chúc {name} đủ mạnh mẽ để vượt qua giông bão, đủ kiên trì để chạm đến ước mơ và đủ yêu thương để mỗi ngày đều trở nên đáng nhớ.",
    "Chúc {name} ngày 20/10 thật nhiều niềm vui, nhận được những món quà ý nghĩa và những lời chúc chân thành. Đặc biệt, mong {name} luôn biết rằng mình xứng đáng với mọi điều tốt đẹp trên đời.",
    "Mong {name} luôn có một trái tim ấm áp, một tâm hồn an nhiên và một cuộc sống đầy ắp tiếng cười. Chúc mọi điều {name} mong cầu đều đến đúng lúc và theo cách đẹp đẽ nhất.",
    "Chúc {name} luôn tỏa sáng như một đóa hoa, không cần giống bất kỳ ai và cũng chẳng cần sự công nhận của ai để biết rằng mình vô cùng quý giá.",
    "Nhân ngày 20/10, chúc {name} có sức khỏe để tận hưởng cuộc sống, có bản lĩnh để chinh phục thử thách và có thật nhiều yêu thương để trái tim luôn ấm áp.",
    "Chúc cho những ngày phía trước của {name} luôn có nắng ấm, có người sẻ chia, có công việc khiến {name} tự hào và có một mái ấm để bình yên trở về.",
    "Mong rằng mỗi sáng thức dậy, {name} đều cảm thấy biết ơn vì được sống; mỗi tối đi ngủ, {name} đều mỉm cười vì đã có một ngày ý nghĩa. Chúc {name} 20/10 thật hạnh phúc!",
    "Chúc {name} luôn được yêu thương đúng cách, được lắng nghe bằng sự chân thành và được trân trọng bởi chính con người tuyệt vời mà {name} đang là.",
    "Ngày 20/10, chúc {name} bỏ lại những muộn phiền, mở lòng đón nhận niềm vui và tự thưởng cho mình những phút giây thật bình yên. {name} xứng đáng được hạnh phúc mỗi ngày.",
    "Chúc {name} luôn giữ được sự dịu dàng nhưng không yếu đuối, mạnh mẽ mà vẫn đầy bao dung, độc lập nhưng chẳng bao giờ cô đơn. Chúc mừng ngày Phụ nữ Việt Nam!",
    "Gửi đến {name} lời chúc 20/10 chân thành nhất: mong {name} luôn khỏe mạnh, bình an, thành công và hạnh phúc. Hãy cứ tự tin tỏa sáng, bởi sự hiện diện của {name} đã là một món quà quý giá đối với cuộc đời."
  ];

  let lastIndex = -1;

  window.FlowerWishes = {
    /**
     * Lấy ngẫu nhiên 1 trong 20 câu chúc và thay thế {name} bằng tên người dùng
     */
    getRandomWish(guestName) {
      const name = (guestName || '').trim() || 'bạn';
      let index;
      if (WISHES_20.length <= 1) {
        index = 0;
      } else {
        do {
          index = Math.floor(Math.random() * WISHES_20.length);
        } while (index === lastIndex);
      }
      lastIndex = index;
      const template = WISHES_20[index];
      return template.replaceAll('{name}', name);
    },

    getWish(flowerId, guestName) {
      return this.getRandomWish(guestName);
    },

    list: WISHES_20,
    count: WISHES_20.length
  };
})();
