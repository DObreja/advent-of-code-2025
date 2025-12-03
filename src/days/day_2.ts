import * as fs from 'node:fs';

function validate_id(id_string: string): number {
  // Odd sized string cannot be possibly matched!
  if (id_string.length % 2 == 1) {
    return 0;
  }

  var id_first_half: string = id_string.substring(0, id_string.length / 2)

  // We want to match exactly twice for this case.
  var regex: RegExp = new RegExp(`(${id_first_half}){2}`);
  var regex_match: RegExpMatchArray | null = id_string.match(regex)

  if (regex_match != null) {
    return Number(id_string)
  }

  return 0;
}

function interpret_range(range_string: string): Array<number> {
  var range_id_check: Array<String> = range_string.split("-")

  var current_id: number = Number(range_id_check[0])
  var end_id: number = Number(range_id_check[1])
  var id_array: Array<number> = []
  while (current_id <= end_id) {
    id_array.push(validate_id(String(current_id)));
    current_id += 1;
  }

  return id_array;
}


export function day_two_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_2/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split(",");
  // split_text.pop();

  // console.log(split_text);

  // Invalid id if string made up of ONLY some sequence of digits REPEATED TWICE!
  // Find invalid id by doing the following:
  // Take the length of the number and see if even
  // If odd, then cannot be invalid!
  // If even, then there is a change that it can be invalid
  // var sample_id: string = "11-22";
  var sum_of_ids: number = 0;
  split_text.forEach((range_id: string) => {
    const found_range: Array<number> = interpret_range(range_id);
    const sum = found_range.reduce((partialSum, a) => partialSum + a, 0);
    sum_of_ids += sum;
  })

  console.log(sum_of_ids)

  return 0;
}


// PART 2
function validate_id_more(id_string: string): number {

  var id_first_half: string = id_string.substring(0, id_string.length / 2)

  // Starting from the beginning, see if we can match the given pattern exactly until the end
  var id_current_match: number = 1
  var id_end_match: number = id_first_half.length

  while (id_current_match <= id_end_match) {
    var match_text: string = id_string.substring(0, id_current_match)
    var regex: RegExp = new RegExp(`^(${match_text})+$`);
    var regex_match: RegExpMatchArray | null = id_string.match(regex)

    if (regex_match != null) {
      return Number(id_string)
    }

    id_current_match += 1;
  }

  return 0;
}

function interpret_range_more(range_string: string): Array<number> {
  var range_id_check: Array<String> = range_string.split("-")

  var current_id: number = Number(range_id_check[0])
  var end_id: number = Number(range_id_check[1])
  var id_array: Array<number> = []
  while (current_id <= end_id) {
    id_array.push(validate_id_more(String(current_id)));
    current_id += 1;
  }

  return id_array;
}

export function day_two_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_2/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split(",");
  // split_text.pop();

  // Invalid id if string made up of ONLY some sequence of digits REPEATED TWICE!
  // Find invalid id by doing the following:
  // Take the length of the number and see if even
  // If odd, then cannot be invalid!
  // If even, then there is a change that it can be invalid
  // var sample_id: string = "11-22";

  var sum_of_ids: number = 0;
  split_text.forEach((range_id: string) => {
    const found_range: Array<number> = interpret_range_more(range_id);
    const sum = found_range.reduce((partialSum, a) => partialSum + a, 0);
    sum_of_ids += sum;
  })

  // const found_range: Array<number> = interpret_range_more("101005-101015");
  console.log(sum_of_ids)

  return 0;
}


