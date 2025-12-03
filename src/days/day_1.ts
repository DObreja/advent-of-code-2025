import * as fs from 'node:fs';

function calculate_turn(counter: number, turns: number, direction: string, max_no: number): number {
  var new_counter: number = 0
  if (direction === "R") {
    new_counter = (counter + turns) % max_no

  } else if (direction === "L") {
    new_counter = (counter - turns)
    while (new_counter < 0) {
      new_counter = new_counter + max_no
    }
  }

  return new_counter
}

export function day_one_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_1/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop();

  var dir_no_pairs: Array<(string | number)[]> = split_text.map((val: string) => {
    return [String(val[0]), Number(val.substring(1))];
  })

  // when we hit zero, the zero counter goes up!
  var zero_counter: number = 0;
  var counter: number = 50;
  dir_no_pairs.forEach((dir_no: (string | number)[]) => {
    if (typeof dir_no[1] === 'number' && typeof dir_no[0] === "string") {
      counter = calculate_turn(counter, dir_no[1], dir_no[0], 100);

      if (counter == 0) {
        zero_counter += 1;
      }
    }
    else {
      throw "Crap! Failed here";
    }
  })
}


function calculate_turn_sequence(counter: number, turns: number, direction: string, max_no: number): Array<number> {
  var new_counter: number = 0;
  var zero_hits: number = 0;
  if (direction === "R") {
    new_counter = (counter + turns);
    while (new_counter >= max_no) {
      new_counter -= max_no;
      zero_hits += 1;
    }

  } else if (direction === "L") {
    new_counter = (counter - turns);
    while (new_counter < 0) {
      new_counter += + max_no;
      zero_hits += 1;
    }
  }

  return [new_counter, zero_hits]
}

export function day_one_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_1/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop();

  var dir_no_pairs: Array<(string | number)[]> = split_text.map((val: string) => {
    return [String(val[0]), Number(val.substring(1))];
  })

  // when we hit zero, the zero counter goes up!
  var zero_counter: number = 0;
  var counter: number = 50;
  dir_no_pairs.forEach((dir_no: (string | number)[]) => {
    if (typeof dir_no[1] === 'number' && typeof dir_no[0] === "string") {
      var output_arr: Array<number> = calculate_turn_sequence(counter, dir_no[1], dir_no[0], 100);
      counter = output_arr[0];
      zero_counter += output_arr[1];
    }
    else {
      throw "Crap! Failed here";
    }
  })
}
