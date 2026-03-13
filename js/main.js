$(function () {
  var $menuButton = $(".btn-menu");
  var $gnb = $(".gnb");
  var $gnbItems = $(".gnb-item");
  var $headerQuickMenu = $("#headerQuickMenu");
  var $sec2Tabs = $("#sec2Tabs");
  var $sec2Image = $("#sec2 .sec2-treatment-image");
  var $sec2MainTitleMarquee = $("#sec2MainTitleMarquee");
  var $sec2MainTitle = $("#sec2MainTitle");
  var $sec2MainTitleClone = $("#sec2MainTitleClone");
  var $sec2ServiceTitle = $("#sec2ServiceTitle");
  var $sec2ServiceDesc = $("#sec2ServiceDesc");
  var $sec3Cards = $("#sec3 .sec3-card");
  var $sec7Carousel = $("#sec7Carousel");
  var $sec7Track = $("#sec7Track");
  var $sec7Cards = $();
  var $sec7Prev = $("#sec7Prev");
  var $sec7Next = $("#sec7Next");
  var sec7CarouselIndex = 0;
  var sec2TabData = {
    pico: {
      image: "./assets/images/main/tattoo-removal-treatment.png",
      mainTitleParts: ["통증은 줄이고", "효과는 높이고"],
      serviceTitle: "피코 문신제거",
      serviceDesc: "피코레이저로 문신에 맞춰 효과적이고 세밀한 시술이 가능합니다."
    },
    semi: {
      image: "./assets/images/main/tattoo-removal-treatment.png",
      mainTitleParts: ["잔흔은 줄이고", "자연스러움은 높이고"],
      serviceTitle: "반영구 문신제거",
      serviceDesc: "예민한 부위인 만큼 섬세한 조사로 부작용을 줄이며 효과를 높입니다."
    },
    scalp: {
      image: "./assets/images/main/tattoo-removal-treatment.png",
      mainTitleParts: ["두피 상태에 맞춰", "안전하게 진행하는 문신제거"],
      serviceTitle: "두피 문신제거",
      serviceDesc: "잘못되었거나 번진 두피 문신도 두피와 머리카락의 손상을 최소화하여 시술합니다."
    },
    surgical: {
      image: "./assets/images/main/tattoo-removal-treatment.png",
      mainTitleParts: ["부위 특성에 맞춘", "수술적 문신제거"],
      serviceTitle: "수술적 문신제거",
      serviceDesc: "면접이나 결혼 등으로 빠른 시일 내 제거를 해야 하는 분들께 추천드립니다."
    }
  };
  var quickMenuData = {
    intro: [
      "컴포트의 특별함",
      "전문 의료진",
      "첨단 의료장비",
      "오시는 길",
      "실시간 예약확인"
    ],
    tattoo: [
      "컴포트 문신제거",
      "피코레이저 (+프락셀)",
      "수술적 문신제거",
      "문신제거 원리",
      "문신제거와 통증"
    ],
    anesthesia: [
      "컴포트 마취의 특별함"
    ],
    injection: [
      "리쥬란 힐러",
      "스킨보톡스"
    ]
  };
  var sec7FallbackResults = [
    {
      round: "[손가락] 5회차",
      caption: "시술 후 4개월 경과",
      beforeImageUrl: "./assets/images/main/before-after-sample-1.png",
      beforePosition: "34% center",
      afterImageUrl: "./assets/images/main/tattoo-removal-treatment.png",
      afterPosition: "58% center"
    },
    {
      round: "[팔] 3회차",
      caption: "시술 후 2개월 경과",
      beforeImageUrl: "./assets/images/main/tattoo-removal-treatment.png",
      beforePosition: "28% center",
      afterImageUrl: "./assets/images/main/before-after-sample-1.png",
      afterPosition: "66% center"
    },
    {
      round: "[눈썹] 2회차",
      caption: "시술 후 1개월 경과",
      beforeImageUrl: "./assets/images/main/before-after-sample-1.png",
      beforePosition: "48% 20%",
      afterImageUrl: "./assets/images/main/tattoo-removal-treatment.png",
      afterPosition: "42% 30%"
    },
    {
      round: "[반영구] 4회차",
      caption: "시술 후 3개월 경과",
      beforeImageUrl: "./assets/images/main/tattoo-removal-treatment.png",
      beforePosition: "74% center",
      afterImageUrl: "./assets/images/main/before-after-sample-1.png",
      afterPosition: "44% center"
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readImageField(item, key) {
    if (item[key]) {
      return item[key];
    }

    if (item[key === "beforeImageUrl" ? "beforeImage" : "afterImage"]) {
      return item[key === "beforeImageUrl" ? "beforeImage" : "afterImage"];
    }

    if (key === "beforeImageUrl" && item.before && item.before.imageUrl) {
      return item.before.imageUrl;
    }

    if (key === "afterImageUrl" && item.after && item.after.imageUrl) {
      return item.after.imageUrl;
    }

    return "";
  }

  function readPositionField(item, key, fallback) {
    if (item[key]) {
      return item[key];
    }

    if (key === "beforePosition" && item.before && item.before.position) {
      return item.before.position;
    }

    if (key === "afterPosition" && item.after && item.after.position) {
      return item.after.position;
    }

    return fallback;
  }

  function normalizeSec7Results(payload) {
    var items = payload;

    if ($.isPlainObject(payload)) {
      items = payload.items || payload.results || payload.data || [];
    }

    if (!$.isArray(items)) {
      return [];
    }

    return $.map(items, function (item) {
      return {
        round: item.round || item.roundLabel || item.title || "",
        caption: item.caption || item.elapsedText || item.description || "",
        beforeImageUrl: readImageField(item, "beforeImageUrl"),
        beforePosition: readPositionField(item, "beforePosition", "center"),
        afterImageUrl: readImageField(item, "afterImageUrl"),
        afterPosition: readPositionField(item, "afterPosition", "center")
      };
    });
  }

  function renderSec7Results(results) {
    var html = "";

    $.each(results, function (_, item) {
      var round = escapeHtml(item.round);
      var caption = escapeHtml(item.caption);
      var beforeImageUrl = escapeHtml(item.beforeImageUrl);
      var beforePosition = escapeHtml(item.beforePosition || "center");
      var afterImageUrl = escapeHtml(item.afterImageUrl);
      var afterPosition = escapeHtml(item.afterPosition || "center");

      html += '<article class="sec7-result-card">';
      html += '<strong class="sec7-result-round">' + round + "</strong>";
      html += '<div class="sec7-result-images">';
      html += '<div class="sec7-result-photo sec7-result-photo--before" style="background-image:url(\'' + beforeImageUrl + '\'); background-position:' + beforePosition + ';">';
      html += '<span class="sec7-result-badge">BEFORE</span>';
      html += "</div>";
      html += '<div class="sec7-result-photo sec7-result-photo--after" style="background-image:url(\'' + afterImageUrl + '\'); background-position:' + afterPosition + ';">';
      html += '<span class="sec7-result-badge">AFTER</span>';
      html += "</div>";
      html += "</div>";
      html += '<p class="sec7-result-caption">' + caption + "</p>";
      html += "</article>";
    });

    if (!html) {
      html = '<article class="sec7-result-card sec7-result-card--empty"><p class="sec7-result-empty">등록된 시술 결과가 없습니다.</p></article>';
    }

    $sec7Track.html(html);
    $sec7Cards = $sec7Track.find(".sec7-result-card").not(".sec7-result-card--empty");
    sec7CarouselIndex = 0;
    renderSec7Carousel();
  }

  function loadSec7Results() {
    var apiUrl = $.trim(String($sec7Carousel.data("apiUrl") || ""));

    if (!apiUrl) {
      renderSec7Results(sec7FallbackResults);
      return;
    }

    $.getJSON(apiUrl)
      .done(function (payload) {
        var results = normalizeSec7Results(payload);

        if (!results.length) {
          renderSec7Results(sec7FallbackResults);
          return;
        }

        renderSec7Results(results);
      })
      .fail(function () {
        renderSec7Results(sec7FallbackResults);
      });
  }

  function renderQuickMenu(menuKey) {
    var menuItems = quickMenuData[menuKey] || [];
    var html = "";

    $.each(menuItems, function (index, label) {
      html += '<a href="#" class="quick-menu-link">' + label + "</a>";
    });

    $headerQuickMenu.html(html);
  }

  function renderSec2MainTitle(mainTitleParts) {
    var parts = mainTitleParts || [];
    var html = "";

    $.each(parts, function (_, label) {
      html += '<span class="sec2-title-main-piece">' + label + "</span>";
    });

    return html;
  }

  function renderSec2Tab(tabKey) {
    var tabData = sec2TabData[tabKey];

    if (!tabData) {
      return;
    }

    $sec2MainTitle.html(renderSec2MainTitle(tabData.mainTitleParts));
    $sec2MainTitleClone.html(renderSec2MainTitle(tabData.mainTitleParts));
    $sec2ServiceTitle.text(tabData.serviceTitle);
    $sec2ServiceDesc.text(tabData.serviceDesc);
    $sec2Image.css("background-image", 'url("' + tabData.image + '")');
    $sec2MainTitleMarquee.css("animation", "none");
    $sec2MainTitleMarquee[0].offsetHeight;
    $sec2MainTitleMarquee.css("animation", "");

    $sec2Tabs.find("li").removeClass("is-active");
    $sec2Tabs.find('button[data-tab="' + tabKey + '"]').closest("li").addClass("is-active");
  }

  function setActiveSec3Card($card) {
    if (!$card.length) {
      return;
    }

    $sec3Cards.removeClass("is-active");
    $card.addClass("is-active");
  }

  function getSec7PerView() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      return 1;
    }

    return 2;
  }

  function renderSec7Carousel() {
    var perView;
    var maxIndex;
    var cardWidth;
    var translateX;
    var carouselWidth;
    var maxScrollLeft;
    var targetScrollLeft;
    var $targetCard;
    var targetLeft;
    var isMobile;

    if (!$sec7Track.length) {
      return;
    }

    if (!$sec7Cards.length) {
      $sec7Track.css("transform", "translateX(0)");
      $sec7Prev.prop("disabled", true);
      $sec7Next.prop("disabled", true);
      return;
    }

    perView = getSec7PerView();
    maxIndex = Math.max($sec7Cards.length - perView, 0);
    sec7CarouselIndex = Math.min(sec7CarouselIndex, maxIndex);
    isMobile = window.matchMedia("(max-width: 800px)").matches;
    cardWidth = $sec7Cards.first().outerWidth(true);
    translateX = -(sec7CarouselIndex * cardWidth);

    if (isMobile) {
      $targetCard = $sec7Cards.eq(sec7CarouselIndex);
      carouselWidth = $sec7Carousel.innerWidth();
      maxScrollLeft = $sec7Carousel[0].scrollWidth - $sec7Carousel.innerWidth();

      $sec7Track.css("transform", "translateX(0)");

      if ($targetCard.length && carouselWidth) {
        targetLeft = $targetCard[0].offsetLeft;
        targetScrollLeft = targetLeft - ((carouselWidth - $targetCard.outerWidth()) / 2);
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, Math.max(maxScrollLeft, 0)));
        $sec7Carousel[0].scrollTo({
          left: targetScrollLeft,
          behavior: "smooth"
        });
      }
    } else {
      $sec7Carousel.scrollLeft(0);
      $sec7Track.css("transform", "translateX(" + translateX + "px)");
    }
    $sec7Prev.prop("disabled", maxIndex === 0);
    $sec7Next.prop("disabled", maxIndex === 0);
  }

  $menuButton.on("click", function () {
    $gnb.toggleClass("is-open");
  });

  $gnbItems.on("mouseenter focusin", function () {
    var $currentItem = $(this);
    var menuKey = $currentItem.data("menu");

    $gnbItems.removeClass("is-active");
    $currentItem.addClass("is-active");
    renderQuickMenu(menuKey);
  });

  renderQuickMenu("intro");

  $sec2Tabs.on("click", "button", function () {
    var tabKey = $(this).data("tab");
    renderSec2Tab(tabKey);
  });

  $sec3Cards.on("click focusin", function () {
    setActiveSec3Card($(this));
  });

  $sec7Prev.on("click", function () {
    var maxIndex = Math.max($sec7Cards.length - getSec7PerView(), 0);

    if (!maxIndex) {
      return;
    }

    if (sec7CarouselIndex === 0) {
      sec7CarouselIndex = maxIndex;
    } else {
      sec7CarouselIndex -= 1;
    }

    renderSec7Carousel();
  });

  $sec7Next.on("click", function () {
    var maxIndex = Math.max($sec7Cards.length - getSec7PerView(), 0);

    if (!maxIndex) {
      return;
    }

    if (sec7CarouselIndex >= maxIndex) {
      sec7CarouselIndex = 0;
    } else {
      sec7CarouselIndex += 1;
    }

    renderSec7Carousel();
  });

  $(window).on("resize", renderSec7Carousel);

  renderSec2Tab("pico");
  loadSec7Results();
});
