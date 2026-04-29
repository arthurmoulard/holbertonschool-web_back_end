# ES6 Classes — Learning Objectives

## 1. How to define a Class

In JavaScript (ES6+), a class is defined using the `class` keyword. It is syntactic sugar over the existing prototype-based inheritance.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

const dog = new Animal('Rex');
console.log(dog.name); // Rex
```

> The `constructor` method is called automatically when a new instance is created with `new`.

---

## 2. How to add methods to a class

Methods are defined directly inside the class body, without the `function` keyword.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }

  toString() {
    return `Animal: ${this.name}`;
  }
}

const cat = new Animal('Whiskers');
console.log(cat.speak()); // Whiskers makes a noise.
```

Methods defined this way are added to the **prototype** of the class, meaning they are shared across all instances.

---

## 3. Why and how to add a static method to a class

### Why?

A **static method** belongs to the **class itself**, not to any instance. It is useful for:

- Utility/helper functions related to the class
- Factory methods (alternative constructors)
- Operations that don't depend on instance data

### How?

Use the `static` keyword before the method name.

```javascript
class MathHelper {
  static add(a, b) {
    return a + b;
  }

  static square(n) {
    return n * n;
  }
}

console.log(MathHelper.add(3, 4));    // 7
console.log(MathHelper.square(5));    // 25

// ❌ Static methods are NOT callable on instances
const m = new MathHelper();
m.add(1, 2); // TypeError: m.add is not a function
```

---

## 4. How to extend a class from another

Use the `extends` keyword to create a **child class** that inherits from a **parent class**.  
Use `super()` to call the parent's constructor, and `super.method()` to call a parent method.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // calls Animal's constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks.`; // overrides parent method
  }

  info() {
    return `${super.speak()} It is a ${this.breed}.`; // calls parent method
  }
}

const d = new Dog('Rex', 'Labrador');
console.log(d.speak()); // Rex barks.
console.log(d.info());  // Rex makes a noise. It is a Labrador.
```

> **Rules:**
> - `super()` must be called **before** accessing `this` in a child constructor.
> - A child class inherits all methods and properties from the parent.
> - Methods can be **overridden** in the child class.

---

## 5. Metaprogramming and Symbols

### Metaprogramming

Metaprogramming is writing code that **manipulates or introspects other code** at runtime. In JavaScript, key tools include:

- **`Symbol`** — unique, non-string property keys
- **`Reflect`** — low-level object operations (get, set, apply…)
- **`Proxy`** — intercept and customize object operations

#### Example with `Proxy`

```javascript
const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : `Property "${prop}" not found`;
  }
};

const obj = new Proxy({ name: 'Alice' }, handler);
console.log(obj.name);  // Alice
console.log(obj.age);   // Property "age" not found
```

---

### Symbols

A **Symbol** is a primitive type that is **always unique** and **immutable**. It is often used as:

- Unique object keys (avoids naming collisions)
- Well-known symbols to customize built-in behavior

```javascript
const id = Symbol('id');
const user = {
  name: 'Alice',
  [id]: 42 // Symbol used as a key
};

console.log(user[id]); // 42
console.log(user.id);  // undefined (regular string key, not the Symbol)
```

#### Well-known Symbols

JavaScript provides built-in Symbols to hook into language internals:

| Symbol | Purpose |
|---|---|
| `Symbol.iterator` | Custom iteration with `for...of` |
| `Symbol.toPrimitive` | Custom type coercion |
| `Symbol.hasInstance` | Customize `instanceof` |
| `Symbol.toStringTag` | Customize `Object.prototype.toString` |

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]
```

> Symbols are **not enumerable** by default — they won't appear in `for...in` loops or `Object.keys()`, making them ideal for "hidden" metadata.
