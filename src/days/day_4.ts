import * as fs from 'node:fs';

// A map is interpreted here accordingly
class MapGrid {
  grid: Array<Array<string>>;
  max_x: number;
  max_y: number;

  constructor(raw_hash: Array<string>) {
    var new_arr: Array<Array<string>> = raw_hash.map((str: string) => { return str.split("") });
    this.grid = new_arr;

    // x and y starts at 0 btw
    this.max_x = new_arr[0].length - 1;
    this.max_y = new_arr.length - 1;
  }

  // Note if we fall out of bounds, we return a . to mark as empty place!
  get_position(x: number, y: number): string {
    if (x < 0 || y < 0 || x > this.max_x || y > this.max_y) {
      return "."
    }

    return this.grid[y][x];
  }

  set_symbol(x: number, y: number, symbol: string): void {
    this.grid[y][x] = symbol;
  }
}

class ForkliftObject {
  x_pos: number;
  y_pos: number;
  max_rolls: number;
  map: MapGrid;

  // Normal signature with defaults
  constructor(map: MapGrid, x: number = 0, y: number = 0, max_rolls: number = 4) {
    this.x_pos = x;
    this.y_pos = y;
    this.max_rolls = max_rolls;
    this.map = map;
  }

  set_position(x: number, y: number): void {
    this.x_pos = x;
    this.y_pos = y;
  }

  get_adjacent_rolls(): number {
    var rolls_of_paper: number = 0;
    if (this.map.get_position(this.x_pos - 1, this.y_pos - 1) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos - 1, this.y_pos + 0) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos - 1, this.y_pos + 1) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos + 0, this.y_pos - 1) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos + 0, this.y_pos + 1) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos + 1, this.y_pos - 1) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos + 1, this.y_pos + 0) == "@") {
      rolls_of_paper += 1;
    }

    if (this.map.get_position(this.x_pos + 1, this.y_pos + 1) == "@") {
      rolls_of_paper += 1;
    }
    return rolls_of_paper;
  }

  is_forkliftable(): boolean {
    var current_pos_symbol: string = this.map.get_position(this.x_pos, this.y_pos);

    if (current_pos_symbol == ".") {
      return false;
    }

    if (this.get_adjacent_rolls() < this.max_rolls) {
      return true
    } else {
      return false;
    }
  }

  remove_roll(): void {
    this.map.set_symbol(this.x_pos, this.y_pos, ".");
  }
}


// This one should be straightforward
// Make some kind of object scanner
//
// Then afterward, add a function that checks in a radius around the scanner
// Note: Forklift can only access if fewer than 4 rolls!
export function day_three_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_4/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO TOGGLE THIS!

  var this_map: MapGrid = new MapGrid(split_text);

  var the_forklift: ForkliftObject = new ForkliftObject(this_map)

  var valid_rolls: number = 0;
  var cur_y: number = 0;
  while (cur_y <= this_map.max_y) {
    var cur_x: number = 0;
    while (cur_x <= this_map.max_x) {
      the_forklift.set_position(cur_x, cur_y)

      if (the_forklift.is_forkliftable() == true) {
        valid_rolls += 1;
      }

      cur_x += 1;
    }
    cur_y += 1;
  }

  console.log(valid_rolls)

  return 0;
}


// With a few minor changes, it should work like a rug...
export function day_three_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_4/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO TOGGLE THIS!

  var this_map: MapGrid = new MapGrid(split_text);

  var the_forklift: ForkliftObject = new ForkliftObject(this_map)

  var valid_rolls: number = 0;
  var cur_y: number = 0;
  while (true) {
    while (cur_y <= this_map.max_y) {
      var cur_x: number = 0;
      while (cur_x <= this_map.max_x) {
        the_forklift.set_position(cur_x, cur_y)

        if (the_forklift.is_forkliftable() == true) {
          valid_rolls += 1;
          the_forklift.remove_roll();
        }

        cur_x += 1;
      }
      cur_y += 1;
    }
    cur_y = 0;
    console.log(valid_rolls);
  }
}
