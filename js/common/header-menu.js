(function (window) {
  var site = window.ComfortSite = window.ComfortSite || {};
  site.modules = site.modules || {};

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  site.modules.initHeaderMenu = function initHeaderMenu(options) {
    var $headerArea = options.headerArea;
    var $menuButton = options.menuButton;
    var $mobileHome = options.mobileHome;
    var $gnbItems = options.gnbItems;
    var $quickMenu = options.quickMenu;
    var $mobileMenuBackdrop = options.mobileMenuBackdrop;
    var $mobileMenuPanel = options.mobileMenuPanel;
    var $mobileMenuGroups = options.mobileMenuGroups;
    var navigationMenus = options.navigationMenus || {};
    var defaultMenuKey = options.defaultMenuKey || "intro";
    var mobileQuery = window.matchMedia ? window.matchMedia("(max-width: 1024px)") : null;
    var lastOpenMenuKey = defaultMenuKey;
    var lockedScrollTop = 0;

    function isMobileViewport() {
      return mobileQuery ? mobileQuery.matches : window.innerWidth <= 1024;
    }

    function getTopLevelMenus() {
      var menus = [];

      $gnbItems.each(function () {
        var $item = $(this);
        var menuKey = String($item.data("menu") || "");

        if (!menuKey) {
          return;
        }

        menus.push({
          key: menuKey,
          label: $.trim($item.text())
        });
      });

      return menus;
    }

    function getMenuItems(menuKey) {
      return $.isArray(navigationMenus[menuKey]) ? navigationMenus[menuKey] : [];
    }

    function renderQuickMenu(menuKey) {
      var menuItems = getMenuItems(menuKey);
      var html = "";

      $.each(menuItems, function (_, item) {
        var menuItem = $.isPlainObject(item) ? item : { label: item, href: "#" };
        var href = escapeHtml(menuItem.href || "#");
        var pageKey = escapeHtml(menuItem.pageKey || "");
        var label = escapeHtml(menuItem.label || "");

        html += '<a href="' + href + '" class="quick-menu-link" data-page-key="' + pageKey + '">' + label + "</a>";
      });

      $quickMenu.html(html);
    }

    function setActiveDesktopMenu(menuKey) {
      if (!$gnbItems.length) {
        return;
      }

      $gnbItems.removeClass("is-active");
      $gnbItems.filter('[data-menu="' + menuKey + '"]').addClass("is-active");

      if ($quickMenu.length) {
        renderQuickMenu(menuKey);
      }
    }

    function renderMobileMenu() {
      if (!$mobileMenuGroups.length) {
        return;
      }

      var html = "";
      var menus = getTopLevelMenus();

      $.each(menus, function (_, menu) {
        var menuItems = getMenuItems(menu.key);
        var isOpen = menu.key === lastOpenMenuKey;

        html += '<section class="mobile-menu-group' + (isOpen ? " is-open" : "") + '" data-menu="' + escapeHtml(menu.key) + '">';
        html += '<button type="button" class="mobile-menu-toggle" aria-expanded="' + (isOpen ? "true" : "false") + '">';
        html += '<span class="mobile-menu-toggle-label">' + escapeHtml(menu.label) + "</span>";
        html += '<span class="mobile-menu-toggle-icon" aria-hidden="true"></span>';
        html += "</button>";
        html += '<div class="mobile-menu-submenu"' + (isOpen ? "" : " hidden") + ">";

        $.each(menuItems, function (_, item) {
          var menuItem = $.isPlainObject(item) ? item : { label: item, href: "#" };
          var href = escapeHtml(menuItem.href || "#");
          var pageKey = escapeHtml(menuItem.pageKey || "");
          var label = escapeHtml(menuItem.label || "");

          html += '<a href="' + href + '" class="mobile-menu-link" data-page-key="' + pageKey + '">' + label + "</a>";
        });

        html += "</div>";
        html += "</section>";
      });

      $mobileMenuGroups.html(html);
    }

    function setOpenMobileGroup(menuKey) {
      if (!$mobileMenuGroups.length) {
        return;
      }

      lastOpenMenuKey = menuKey || defaultMenuKey;

      $mobileMenuGroups.find(".mobile-menu-group").each(function () {
        var $group = $(this);
        var isTarget = String($group.data("menu")) === lastOpenMenuKey;

        $group.toggleClass("is-open", isTarget);
        $group.find(".mobile-menu-toggle").attr("aria-expanded", isTarget ? "true" : "false");
        $group.find(".mobile-menu-submenu").prop("hidden", !isTarget);
      });

      setActiveDesktopMenu(lastOpenMenuKey);
    }

    function closeMobileGroups() {
      if (!$mobileMenuGroups.length) {
        return;
      }

      $mobileMenuGroups.find(".mobile-menu-group").removeClass("is-open");
      $mobileMenuGroups.find(".mobile-menu-toggle").attr("aria-expanded", "false");
      $mobileMenuGroups.find(".mobile-menu-submenu").prop("hidden", true);
    }

    function openMobileMenu() {
      if (!isMobileViewport() || !$mobileMenuPanel.length) {
        return;
      }

      if (!$mobileMenuGroups.children().length) {
        renderMobileMenu();
      }

      setOpenMobileGroup(lastOpenMenuKey);
      $headerArea.addClass("is-mobile-menu-open");
      lockedScrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.setProperty("--mobile-scroll-lock-offset", (-lockedScrollTop) + "px");
      $("body").addClass("is-mobile-menu-open");
      $mobileMenuPanel.prop("hidden", false);
      $mobileMenuBackdrop.prop("hidden", false);
      $menuButton.attr({
        "aria-expanded": "true",
        "aria-label": "메뉴 닫기"
      });
    }

    function closeMobileMenu() {
      if (!$mobileMenuPanel.length) {
        return;
      }

      var wasOpen = $headerArea.hasClass("is-mobile-menu-open");

      $headerArea.removeClass("is-mobile-menu-open");
      $("body").removeClass("is-mobile-menu-open");
      document.body.style.removeProperty("--mobile-scroll-lock-offset");
      $mobileMenuPanel.prop("hidden", true);
      $mobileMenuBackdrop.prop("hidden", true);
      $menuButton.attr({
        "aria-expanded": "false",
        "aria-label": "메뉴 열기"
      });

      if (wasOpen) {
        window.scrollTo(0, lockedScrollTop);
      }
    }

    function handleBreakpointChange() {
      if (!isMobileViewport()) {
        closeMobileMenu();
      }
    }

    if ($menuButton.length) {
      $menuButton.on("click", function () {
        if (!isMobileViewport()) {
          return;
        }

        if ($headerArea.hasClass("is-mobile-menu-open")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if ($gnbItems.length && $quickMenu.length) {
      $gnbItems.on("mouseenter focusin", function () {
        setActiveDesktopMenu(String($(this).data("menu") || defaultMenuKey));
      });

      setActiveDesktopMenu(defaultMenuKey);
    }

    if ($mobileMenuGroups.length) {
      renderMobileMenu();

      $mobileMenuGroups.on("click", ".mobile-menu-toggle", function () {
        var $group = $(this).closest(".mobile-menu-group");
        var menuKey = String($group.data("menu") || defaultMenuKey);
        var isOpen = $group.hasClass("is-open");

        if (isOpen) {
          closeMobileGroups();
        } else {
          setOpenMobileGroup(menuKey);
        }
      });

      $mobileMenuGroups.on("click", ".mobile-menu-link", function () {
        if (isMobileViewport()) {
          closeMobileMenu();
        }
      });
    }

    if ($mobileMenuBackdrop.length) {
      $mobileMenuBackdrop.on("click", closeMobileMenu);
    }

    if ($mobileHome.length) {
      $mobileHome.on("click", function () {
        closeMobileMenu();
      });
    }

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    if (mobileQuery) {
      if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleBreakpointChange);
      } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(handleBreakpointChange);
      }
    } else {
      $(window).on("resize", handleBreakpointChange);
    }
  };
})(window);
