document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('codeInput');
    const handwrittenCode = document.getElementById('handwrittenCode');
    const exportButton = document.getElementById('exportButton');
    const codeHighlight = document.querySelector('.code-highlight code');
    const languageSelect = document.getElementById('languageSelect');

   
    const languagePatterns = {
        javascript: {
            patterns: [
                /function\s+\w+\s*\(/,
                /const\s+|let\s+|var\s+/,
                /=>/,
                /console\.log/
            ]
        },
        python: {
            patterns: [
                /def\s+\w+\s*\(/,
                /import\s+\w+/,
                /print\s*\(/,
                /:\s*$/m
            ]
        },
        java: {
            patterns: [
                /public\s+class/,
                /public\s+static\s+void\s+main/,
                /System\.out\.println/
            ]
        },
        cpp: {
            patterns: [
                /#include/,
                /std::/,
                /cout\s*<</,
                /int\s+main\s*\(/
            ]
        },
        css: {
            patterns: [
                /{\s*[\w-]+\s*:/,
                /\.[a-zA-Z][\w-]*\s*{/,
                /@media/
            ]
        },
        markup: {
            patterns: [
                /<\/?[a-z][\w-]*>/i,
                /<div/,
                /<html/,
                /<body/
            ]
        },
        scala: {
            patterns: [
                /object\s+\w+/,           // object 定义
                /case\s+class/,           // case class
                /def\s+\w+\s*\([^\)]*\)\s*:/,  // 函数定义
                /val\s+|var\s+/,          // 变量定义
                /extends\s+\w+/,          // 继承
                /trait\s+\w+/,            // trait 定义
                /=>/,                     // 箭头函数
                /println/                  // 打印语句
            ]
        }
    };

    
    function detectLanguage(code) {
        let maxScore = 0;
        let detectedLang = 'javascript'; 

        for (let lang in languagePatterns) {
            let score = 0;
            for (let pattern of languagePatterns[lang].patterns) {
                if (pattern.test(code)) {
                    score++;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                detectedLang = lang;
            }
        }

        return maxScore > 0 ? detectedLang : 'javascript';
    }

   
    function updateCode() {
        const code = codeInput.value;
        
      
        if (languageSelect.value === 'auto') {
            const detectedLang = detectLanguage(code);
            codeHighlight.className = `language-${detectedLang}`;
          
            if (code.trim() !== '') {
                languageSelect.value = detectedLang;
            }
        }

       
        codeHighlight.textContent = code;
        Prism.highlightElement(codeHighlight);

       
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        handwrittenCode.innerHTML = escapedCode;
    }

   
    languageSelect.addEventListener('change', function() {
        if (this.value !== 'auto') {
            codeHighlight.className = `language-${this.value}`;
            updateCode();
        }
    });

   
    codeInput.value = '// 这是一个示例代码\nfunction hello() {\n    console.log("Hello World!");\n}';
    updateCode();

   
    codeInput.addEventListener('scroll', function(e) {
        const codeHighlight = document.querySelector('.code-highlight');
        codeHighlight.scrollTop = e.target.scrollTop;
    });

    codeInput.addEventListener('input', updateCode);

    
    codeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            updateCode();
        }
    });

 
    exportButton.addEventListener('click', function() {
        const originalBackground = handwrittenCode.style.background;
        handwrittenCode.style.background = 'white';

        html2canvas(handwrittenCode, {
            backgroundColor: '#ffffff',
            scale: 2,
        }).then(function(canvas) {
            handwrittenCode.style.background = originalBackground;
            const link = document.createElement('a');
            link.download = 'handwritten-code.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
}); 