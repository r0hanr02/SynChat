Here's a JavaScript function that determines if a number is prime. If it's not prime, it returns the smallest factor
(other than 1) of that number. If it is prime, it indicates that.

The function returns an object to clearly communicate both the primality status and, if applicable, the factor.

````javascript
/**
* Checks if a number is prime. If not prime, it returns the smallest factor.
*
* @param {number} num The number to check. Must be a non-negative integer.
* @returns {{isPrime: boolean, number: number, factor?: number, reason?: string}} An object
* indicating if the number is prime. If not prime, it includes a `factor` property
* with the smallest factor found. For special cases (0, 1, invalid input), it
* provides a `reason`.
*/
function isPrimeOrFactor(num) {
// 1. Input Validation
if (typeof num !== 'number' || !Number.isInteger(num)) {
return { isPrime: false, reason: "Input must be an integer." };
}
if (num < 0) { return { isPrime: false, reason: "Input must be a non-negative integer." }; } // 2. Handle Special Cases
    // Numbers less than or equal to 1 are not prime by definition if (num <=1) { return { isPrime: false, number: num,
    reason: `${num} is not a prime number by definition.` }; } // 2 is the only even prime number if (num===2) { return
    { isPrime: true, number: num }; } // All other even numbers are not prime, and 2 is their smallest factor if (num %
    2===0) { return { isPrime: false, number: num, factor: 2 }; } // 3. Check for Odd Divisors // We only need to check
    odd divisors from 3 up to the square root of num. // If num has a factor greater than its square root, it must also
    have a factor // smaller than its square root (which we would have already found). for (let i=3; i * i <=num; i +=2)
    { if (num % i===0) { return { isPrime: false, number: num, factor: i }; // Found a factor } } // 4. If no factors
    were found, the number is prime return { isPrime: true, number: num }; } // --- Examples --- console.log("--- Prime
    Numbers ---"); console.log("Is 2 prime?", isPrimeOrFactor(2)); // { isPrime: true, number: 2 } console.log("Is 3
    prime?", isPrimeOrFactor(3)); // { isPrime: true, number: 3 } console.log("Is 5 prime?", isPrimeOrFactor(5)); // {
    isPrime: true, number: 5 } console.log("Is 17 prime?", isPrimeOrFactor(17)); // { isPrime: true, number: 17 }
    console.log("Is 97 prime?", isPrimeOrFactor(97)); // { isPrime: true, number: 97 } console.log("\n--- Non-Prime
    Numbers ---"); console.log("Is 0 prime?", isPrimeOrFactor(0)); // { isPrime: false, number: 0,
    reason: "0 is not a prime number by definition." } console.log("Is 1 prime?", isPrimeOrFactor(1)); // { isPrime:
    false, number: 1, reason: "1 is not a prime number by definition." } console.log("Is 4 prime?", isPrimeOrFactor(4));
    // { isPrime: false, number: 4, factor: 2 } console.log("Is 6 prime?", isPrimeOrFactor(6)); // { isPrime: false,
    number: 6, factor: 2 } console.log("Is 9 prime?", isPrimeOrFactor(9)); // { isPrime: false, number: 9, factor: 3 }
    console.log("Is 15 prime?", isPrimeOrFactor(15)); // { isPrime: false, number: 15, factor: 3 } console.log("Is 25
    prime?", isPrimeOrFactor(25)); // { isPrime: false, number: 25, factor: 5 } console.log("Is 99 prime?",
    isPrimeOrFactor(99)); // { isPrime: false, number: 99, factor: 3 } console.log("Is 100 prime?",
    isPrimeOrFactor(100));// { isPrime: false, number: 100, factor: 2 } console.log("\n--- Invalid Inputs ---");
    console.log("Is 'hello' prime?", isPrimeOrFactor('hello')); // { isPrime: false, reason: "Input must be an integer."
    } console.log("Is 3.14 prime?", isPrimeOrFactor(3.14)); // { isPrime: false, reason: "Input must be an integer." }
    console.log("Is -7 prime?", isPrimeOrFactor(-7)); // { isPrime: false,
    reason: "Input must be a non-negative integer." } ``` ### Explanation: 1. **Input Validation:** * It first checks if
    the input `num` is actually a `number` and an `integer`. * It also ensures `num` is non-negative, as prime numbers
    are defined for positive integers. 2. **Handle Special Cases:** * `num <=1`: Numbers `0` and `1` are not considered
    prime numbers by definition. * `num===2`: The number `2` is the first and only even prime number. * `num % 2===0`
    (for `num> 2`): Any other even number (greater than 2) is divisible by 2 and therefore not prime. In this case, `2`
    is returned as its smallest factor.

    3. **Check for Odd Divisors (Optimized Loop):**
    * The loop starts from `i = 3` and increments `i` by `2` in each step (`i += 2`). This means it only checks odd
    numbers as potential divisors (since we've already handled even numbers).
    * The loop condition `i * i <= num` is an optimization. We only need to check for divisors up to the square root of
        `num`. If `num` has a factor larger than its square root, it must also have a corresponding factor smaller than
        its square root (which would have already been found). * If `num` is divisible by `i` (i.e., `num % i===0`),
        then `num` is not prime, and `i` is its smallest factor found so far. The function immediately returns this
        information. 4. **Prime Number:** * If the loop completes without finding any divisors, it means `num` has no
        factors other than 1 and itself, so it is a prime number. The function then returns `{ isPrime: true, number:
        num }`. This approach is efficient for most practical purposes due to the `sqrt(num)` limit and checking only
        odd divisors.
````
