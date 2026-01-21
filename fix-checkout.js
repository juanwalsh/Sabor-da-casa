const fs = require('fs');

const filePath = 'src/app/checkout/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remover código duplicado após o onSubmit
const duplicatedCode = /  \};\n\n    \/\/ Adicionar campos opcionais[\s\S]*?if \(paymentMethod === 'cash'\)[\s\S]*?  \}\n  \};/m;

content = content.replace(duplicatedCode, '  };');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Código duplicado removido!');
