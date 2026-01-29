/**
 * IE浏览器兼容性处理脚本
 * 支持IE6-IE11
 */

(function() {
    // 检测是否为IE浏览器
    function isIE() {
        var ua = window.navigator.userAgent;
        return ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1;
    }
    
    // 获取IE版本
    function getIEVersion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        
        if (msie > 0) {
            // IE 10 或更早版本
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
        }
        
        var trident = ua.indexOf("Trident/");
        if (trident > 0) {
            // IE 11
            var rv = ua.indexOf("rv:");
            return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
        }
        
        return false;
    }
    
    // 为旧版IE添加class
    function addIEClass() {
        if (isIE()) {
            var ieVersion = getIEVersion();
            var html = document.documentElement;
            
            if (ieVersion) {
                html.className += ' ie ie' + ieVersion;
            } else {
                html.className += ' ie';
            }
            
            // 添加IE特定提示
            if (ieVersion && ieVersion < 9) {
                showIELegacyWarning(ieVersion);
            }
        }
    }
    
    // 显示旧版IE警告
    function showIELegacyWarning(version) {
        var warning = document.createElement('div');
        warning.id = 'ie-legacy-warning';
        warning.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'right: 0',
            'background: #ffeb3b',
            'color: #333',
            'padding: 10px',
            'text-align: center',
            'z-index: 9999',
            'border-bottom: 2px solid #ffc107',
            'font-size: 14px'
        ].join(';');
        
        warning.innerHTML = '您正在使用旧版Internet Explorer ' + version + '，部分功能可能无法正常使用。建议升级到IE11或使用现代浏览器。';
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = [
            'position: absolute',
            'right: 10px',
            'top: 5px',
            'background: none',
            'border: none',
            'font-size: 20px',
            'cursor: pointer',
            'color: #666'
        ].join(';');
        closeBtn.onclick = function() {
            warning.style.display = 'none';
        };
        
        warning.appendChild(closeBtn);
        document.body.insertBefore(warning, document.body.firstChild);
    }
    
    // 修复IE的addEventListener问题
    function fixEventListeners() {
        if (!window.addEventListener) {
            // IE8及以下版本
            window.addEventListener = function(event, handler) {
                return window.attachEvent('on' + event, handler);
            };
        }
    }
    
    // 修复console.log问题
    function fixConsole() {
        if (!window.console) {
            window.console = {};
        }
        var methods = ['log', 'debug', 'info', 'warn', 'error'];
        for (var i = 0; i < methods.length; i++) {
            if (!console[methods[i]]) {
                console[methods[i]] = function() {};
            }
        }
    }
    
    // 修复getElementsByClassName
    function fixGetElementsByClassName() {
        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function(className) {
                var all = document.getElementsByTagName('*');
                var elements = [];
                for (var i = 0; i < all.length; i++) {
                    if (all[i].className.indexOf(className) > -1) {
                        elements.push(all[i]);
                    }
                }
                return elements;
            };
        }
    }
    
    // 修复querySelectorAll
    function fixQuerySelectorAll() {
        if (!document.querySelectorAll) {
            document.querySelectorAll = function(selector) {
                var style = document.createElement('style');
                var elements = [];
                var element;
                
                document.documentElement.firstChild.appendChild(style);
                document._qsa = [];
                
                style.styleSheet.cssText = selector + '{x:expression(document._qsa && document._qsa.push(this))}';
                window.scrollBy(0, 0);
                style.parentNode.removeChild(style);
                
                while (document._qsa.length) {
                    element = document._qsa.shift();
                    element.style.removeAttribute('x');
                    elements.push(element);
                }
                document._qsa = null;
                
                return elements;
            };
        }
    }
    
    // 初始化所有修复
    function init() {
        fixConsole();
        fixGetElementsByClassName();
        fixQuerySelectorAll();
        fixEventListeners();
        addIEClass();
        
        // 为IE添加特定样式
        if (isIE()) {
            var ieVersion = getIEVersion();
            if (ieVersion && ieVersion < 9) {
                // 为IE6-8添加额外的兼容性处理
                fixLegacyIE();
            }
        }
    }
    
    // 修复旧版IE的特定问题
    function fixLegacyIE() {
        // 修复透明度
        var style = document.createElement('style');
        style.type = 'text/css';
        try {
            style.styleSheet.cssText = '.feature, .quick-links, .search-box { zoom: 1; }';
        } catch(e) {
            style.appendChild(document.createTextNode('.feature, .quick-links, .search-box { zoom: 1; }'));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    // 页面加载完成后初始化
    if (window.attachEvent) {
        window.attachEvent('onload', init);
    } else {
        window.addEventListener('load', init, false);
    }
    
    // 导出函数供其他脚本使用
    window.IECompat = {
        isIE: isIE,
        getIEVersion: getIEVersion,
        init: init
    };
})();