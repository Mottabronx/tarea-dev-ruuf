import * as fs from 'fs';

interface TestCase {
  panelW: number;
  panelH: number;
  roofW: number;
  roofH: number;
  expected: number;
}

interface TestData {
  testCases: TestCase[];
}

function calculatePanels(
  panelWidth: number,
  panelHeight: number,
  roofWidth: number,
  roofHeight: number
): number {
  // Implementa acá tu solución
  const memo = new Map<string, number>();
  function solve(w: number, h: number): number {
    // 1. Chequear si esta solución ya existe en nuestro registro
    const key = `${w},${h}`;
    if (memo.has(key)) return memo.get(key)!;

    // 2. Validar que el techo sea lo suficientemente grande para al menos un panel
    const minSide = Math.min(panelWidth, panelHeight);
    if (w < minSide || h < minSide) {
        return 0;
    }

    // 3. Probamos primero las formas simples sin rotar
    // Intentamos colocar los paneles en su orientación original
    const countStandard = Math.floor(w / panelWidth) * Math.floor(h / panelHeight);
    // Intentamos girar los paneles 90 grados para ver si caben mejor
    const countRotated = Math.floor(w / panelHeight) * Math.floor(h / panelWidth);
    
    // El mejor acomodo que hemos encontrado es el que nos da más paneles
    let maxPanels = Math.max(countStandard, countRotated);

    // 4. Probar dividiendo el techo en diferentes secciones
    // Cortamos verticalmente en distintos puntos para ver si obtenemos más paneles
    // La mitad del ancho es suficiente ya que los cortes son simétricos
    for (let i = 1; i <= w / 2; i++) {
      const val = solve(i, h) + solve(w - i, h);
      if (val > maxPanels) maxPanels = val;
    }

    // También intentamos hacer cortes horizontales en el techo
    for (let j = 1; j <= h / 2; j++) {
      const val = solve(w, j) + solve(w, h - j);
      if (val > maxPanels) maxPanels = val;
    }

    // 5. Almacenar en caché y devolver el resultado
    memo.set(key, maxPanels);
    return maxPanels;
  }

  // Comenzamos a resolver el problema usando las medidas del techo
  return solve(roofWidth, roofHeight);
}

function main(): void {
  console.log("🐕 Wuuf wuuf wuuf 🐕");
  console.log("================================\n");
  
  runTests();
}

function runTests(): void {
  const data: TestData = JSON.parse(fs.readFileSync('test_cases.json', 'utf-8'));
  const testCases = data.testCases;
  
  console.log("Corriendo tests:");
  console.log("-------------------");
  
  testCases.forEach((test: TestCase, index: number) => {
    const result = calculatePanels(test.panelW, test.panelH, test.roofW, test.roofH);
    const passed = result === test.expected;
    
    console.log(`Test ${index + 1}:`);
    console.log(`  Panels: ${test.panelW}x${test.panelH}, Roof: ${test.roofW}x${test.roofH}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}`);
    console.log(`  Status: ${passed ? "✅ PASSED" : "❌ FAILED"}\n`);
  });
}

main();
