import * as fs from 'node:fs';

// Simple, we will find the highest joltage and store that in memory!
// Uses a basic dummy 2 pointer approach that is N^2
function joltage_finder_two_pointers(bank: string): number {
  var start_pointer: number = 0;
  var end_pointer: number = bank.length;

  var highest_jolt: number = 0;
  while (start_pointer < end_pointer) {
    var pointer_1: number = start_pointer
    while (pointer_1 < end_pointer) {

      var found_jolt: number = Number(bank[pointer_1] + bank[end_pointer])
      if (found_jolt > highest_jolt) {
        highest_jolt = found_jolt
      }

      pointer_1 += 1;
    }
    end_pointer -= 1;
  }

  return highest_jolt;
}

export function day_three_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_3/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  // Ok, all we need to do is turn on two batteries with the highest numbers...
  // Or something...
  // Another pointer question!

  // var extracted_string: string = "12311111111111";
  var jolt_sum: number = 0;
  split_text.forEach((battery: string) => {
    jolt_sum += joltage_finder_two_pointers(battery);
  })

  console.log(jolt_sum);

  return 0;
}

// Simple, we will find the highest joltage and store that in memory!
// Uses a basic dummy 2 pointer approach that is N^2
function joltage_finder_expanded(bank: string): number {

  var max_pointer_no: number = 12;
  var current_pointer_no: number = 0;

  // Tells us which positions we will want to get our bigga number outta!
  var string_positions: Array<number> = [];
  while (current_pointer_no < max_pointer_no) {
    joltage_by_string_positions_array(string_positions, bank)
    current_pointer_no += 1;
  }

  var total_jolt: number = Number(get_concat_jolt_str(string_positions, bank))

  return total_jolt;
}

function joltage_by_string_positions_array(string_positions: Array<number>, bank: string) {
  var highest_jolt: number = 0;
  var highest_jolt_position: number = -1;
  var end_pointer: number = bank.length;
  var pointer_1: number = 0;

  while (pointer_1 < end_pointer) {
    if (string_positions.length == 0) {
      var found_jolt: number = Number(bank[pointer_1])
      if (found_jolt > highest_jolt) {
        highest_jolt = found_jolt
        highest_jolt_position = pointer_1
      }
    } else if (!string_positions.includes(pointer_1)) {

      var found_jolt: number = Number(get_concat_jolt_str(string_positions.concat(pointer_1), bank))
      if (found_jolt > highest_jolt) {
        highest_jolt = found_jolt;
        highest_jolt_position = pointer_1;
      }
    }

    pointer_1 += 1;
  }

  string_positions.push(highest_jolt_position)
}

function get_concat_jolt_str(string_positions: Array<number>, bank: string): string {
  var num_array = string_positions;
  num_array.sort((a, b) => {
    return a - b;
  });

  var concat_jolt_str: string = ""
  num_array.forEach((num_idx) => {
    concat_jolt_str += bank[num_idx]
  })
  return concat_jolt_str;
}

export function day_three_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_3/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  // This one is a bit different.
  // In this case, we are going to have a cache of batteries to turn on.
  // We will need to find the exact permutation that will lead to this working out the way we want it to...

  // Strategy is simple 
  // Start with finding the highest number with the first pointer
  // Then do a comparison to find the next highest one using the next n pointer 
  // Continue doing until you get to your desired n_max pointer (in this case 12)

  // var extracted_string: string = "818181911112111";
  // var joltage: number = joltage_finder_expanded(extracted_string)

  // console.log(joltage)


  var jolt_sum: number = 0;
  split_text.forEach((battery: string) => {
    jolt_sum += joltage_finder_expanded(battery);
  })

  console.log(jolt_sum);

  return 0;
}
