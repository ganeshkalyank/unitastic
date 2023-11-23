import { calculateCGPA, calculateCanBunk, calculateExternals, calculateSGPA, calculateSGPAForCGPA } from "../../utils/calculators"
import { expect, test } from "vitest"

test('internals to externals', () => {
    expect(calculateExternals(46)).toEqual({
        "S": 90,
        "A+": 80,
        "A": 58,
        "B": 40,
        "C": 18,
        "D": 8
    })
    expect(calculateExternals(50)).toEqual({
        "S": 82,
        "A+": 72,
        "A": 50,
        "B": 32,
        "C": 10,
        "D": 0
    })
    expect(calculateExternals(51)).toEqual({
        "S": "NA",
        "A+": "NA",
        "A": "NA",
        "B": "NA",
        "C": "NA",
        "D": "NA"
    })
})

test('calculating bunkable classes', () => {
    expect(calculateCanBunk(4,0)).toBe(12)
    expect(calculateCanBunk(3,1)).toBe(8)
    expect(calculateCanBunk(2,2)).toBe(4)
})

test('calculating cgpa', () => {
    expect(calculateCGPA([
        {"sgpa":9.8, "credits":4},
        {"sgpa":9.4, "credits":3},
    ]).toFixed(4)).toBe("9.6286")
    expect(calculateCGPA([
        {"sgpa":0, "credits":4},
        {"sgpa":0, "credits":5},
        {"sgpa":0, "credits":7},
    ]).toFixed(4)).toBe("0.0000")
    expect(calculateCGPA([
        {"sgpa":10, "credits":4},
        {"sgpa":10, "credits":3},
        {"sgpa":10, "credits":3},
    ]).toFixed(4)).toBe("10.0000")
})

test('calculating sgpa', () => {
    expect(calculateSGPA([
        {"grade":"S", "credits":4},
        {"grade":"A+", "credits":3},
    ]).toFixed(4)).toBe("9.5714")
    expect(calculateSGPA([
        {"grade":"F", "credits":4},
        {"grade":"F", "credits":5},
        {"grade":"F", "credits":7},
    ]).toFixed(4)).toBe("0.0000")
    expect(calculateSGPA([
        {"grade":"S", "credits":4},
        {"grade":"S", "credits":3},
        {"grade":"S", "credits":3},
    ]).toFixed(4)).toBe("10.0000")
})

test('calculating sgpa for cgpa', () => {
    expect(calculateSGPAForCGPA(9.5, 24, 81, 9.4).toFixed(4)).toBe("9.8375")
    expect(calculateSGPAForCGPA(9.1, 24, 92, 8.97).toFixed(4)).toBe("9.5983")
    expect(calculateSGPAForCGPA(7.5, 21, 83, 6.9).toFixed(4)).toBe("9.8714")
})