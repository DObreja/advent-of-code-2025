import * as fs from 'node:fs';


class ArrayArithmeticer {
  numbers_array: Array<Array<string>>
  operations_array: Array<string>

  constructor(array_input: Array<Array<string>>) {
    var operations: Array<string> | undefined = array_input.pop();

    this.operations_array = []
    if (Array.isArray(operations)) {
      this.operations_array = operations;
    }

    this.numbers_array = array_input;
  }

  tally_operation_array() {
    var tallied_numbers: Array<number> = [];
    this.numbers_array[0].forEach((this_str: string, idx: number) => {
      tallied_numbers.push(this.tally_column(idx));
    });

    const initial_value: number = 0;
    const sum: number = tallied_numbers.reduce(
      (accumulator, initial_value) => accumulator + initial_value,
      initial_value,
    );

    return sum;
  }

  // A multi step process to get whatever our operand demands us to get!
  tally_column(idx: number): number {
    var operand_to_use: string = this.operation_for_idx(idx);
    var sum_operands: number = 0;
    this.column_numbers(idx).every((number: number, idx: number) => {
      if (idx == 0) {
        sum_operands = number;
        return true;
      }

      if (operand_to_use == "*") {
        sum_operands = sum_operands * number;
      } else if (operand_to_use == "+") {
        sum_operands = sum_operands + number;
      }
      return true;
    });
    return sum_operands;
  }

  column_numbers(idx: number): Array<number> {
    return this.numbers_array.map((no_str_arr: Array<string>) => {
      return Number(no_str_arr[idx])
    });
  }

  operation_for_idx(idx: number): string {
    return this.operations_array[idx]
  }
}

export function day_six_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_6/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  var further_split: Array<Array<string>> = split_text.map((no_string: string) => {
    var untrimmed_split: Array<string> = no_string.split(" ");
    var trimmed_split: Array<string> = []
    untrimmed_split.forEach((this_no: string) => {
      if (this_no != "") {
        trimmed_split.push(this_no);
      }
    })
    return trimmed_split;
  })

  var arr_arith_obj: ArrayArithmeticer = new ArrayArithmeticer(further_split);
  console.log(arr_arith_obj.tally_operation_array());

  return 0;
}

class ArrayArithmeticerAlternative {
  numbers_array: Array<Array<string>>
  operations_array: Array<string>
  lengths_array: Array<number>

  constructor(array_input: Array<Array<string>>, lengths_array: Array<number>) {
    var operations: Array<string> | undefined = array_input.pop();

    this.operations_array = []
    if (Array.isArray(operations)) {
      this.operations_array = operations.map((operations_string_unfinished: string) => {
        return operations_string_unfinished[0];
      });
    }
    this.lengths_array = lengths_array;

    this.numbers_array = array_input;
  }

  tally_operation_array() {
    var tallied_numbers: Array<number> = [];
    this.numbers_array[0].forEach((this_str: string, idx: number) => {
      tallied_numbers.push(this.tally_column(idx));
    });

    const initial_value: number = 0;
    const sum: number = tallied_numbers.reduce(
      (accumulator, initial_value) => accumulator + initial_value,
      initial_value,
    );

    return sum;
  }

  // A multi step process to get whatever our operand demands us to get!
  tally_column(idx: number): number {
    var operand_to_use: string = this.operation_for_idx(idx);
    var sum_operands: number = 0;
    this.column_numbers(idx).every((number: number, idx: number) => {
      if (idx == 0) {
        sum_operands = number;
        return true;
      }

      if (operand_to_use == "*") {
        sum_operands = sum_operands * number;
      } else if (operand_to_use == "+") {
        sum_operands = sum_operands + number;
      }
      return true;
    });
    return sum_operands;
  }

  // this is where we make the primary change from right -> left
  column_numbers(idx: number): Array<number> {
    console.log(this.numbers_array[idx])
    var largest_length: number = this.lengths_array[idx];
    var the_numbers_str_arr: Array<string> = this.numbers_array.map((no_str_arr: Array<string>) => {
      return no_str_arr[idx];
    });

    var inverted_numbers: Array<number> = [];
    var no_idx: number = largest_length - 1;

    while (no_idx >= 0) {
      var constructed_number: string = "";
      the_numbers_str_arr.forEach((no_str: string, numbers_idx: number) => {
        if (no_str[no_idx] != " ") {
          constructed_number = constructed_number + no_str[no_idx]
        }
      })

      inverted_numbers.push(Number(constructed_number));
      no_idx -= 1;
    }

    return inverted_numbers;
  }

  operation_for_idx(idx: number): string {
    return this.operations_array[idx]
  }
}

// Some bullshit is what this one is
export function day_six_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_6/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  // We find how much text we should process based on how much text there is on the multiplicative part...
  var operant_part: string = split_text.slice(-1)[0];

  var length_of_string: number = -1;
  var symbol_count: number = 0;
  var length_of_strings_arr: Array<number> = []
  operant_part.split("").every((char: string, idx: number) => {
    if (char != " ") {
      symbol_count += 1;
    }

    console.log(length_of_string)

    if (symbol_count == 2) {
      symbol_count -= 1;
      length_of_strings_arr.push(length_of_string);
      length_of_string = 0;
      return true;
    }

    length_of_string += 1;
    return true
  });
  length_of_string += 1;
  length_of_strings_arr.push(length_of_string)

  var further_split_entire: Array<Array<string>> = split_text.map((no_string: string, idx: number) => {
    var constructed_string_arr: Array<string> = []

    length_of_strings_arr.forEach((length_to_remove: number) => {
      constructed_string_arr.push(no_string.slice(0, length_to_remove))
      no_string = no_string.slice(length_to_remove + 1);
    });

    return constructed_string_arr;
  });

  var arr_arith_obj: ArrayArithmeticerAlternative = new ArrayArithmeticerAlternative(further_split_entire, length_of_strings_arr);
  console.log(arr_arith_obj.tally_operation_array());

  return 0;
}

