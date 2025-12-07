import * as fs from 'node:fs';

class Vector2 {
  x_pos: number;
  y_pos: number;

  constructor(x_pos: number = 0, y_pos: number = 0) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
  }

  // NOTE: Modifies the existing vector!
  add_vector(this_vector: Vector2): void {
    this.x_pos += this_vector.x_pos;
    this.y_pos += this_vector.y_pos;
  }

  is_equal(this_vector: Vector2): boolean {
    if (this.x_pos == this_vector.x_pos && this.y_pos == this_vector.y_pos) {
      return true;
    } else {
      return false;
    }
  }
}


// A map is interpreted here accordingly
class MapGrid {
  grid: Array<Array<string>>;
  max_x: number;
  max_y: number;
  emitter_pos: Vector2;
  tachyon_instances: Array<Tachyon>;

  constructor(raw_hash: Array<string>) {
    var new_arr: Array<Array<string>> = raw_hash.map((str: string) => { return str.split("") });
    this.grid = new_arr;

    // x and y starts at 0 btw, makes most sense to -1 from here as such.
    this.max_x = new_arr[0].length - 1;
    this.max_y = new_arr.length - 1;

    this.tachyon_instances = [];

    this.emitter_pos = new Vector2;
    this.grid[0].every((sym: string, x_pos: number) => {
      if (sym == "S") {
        this.emitter_pos = new Vector2(x_pos, 0)
        return false;
      }
      return true;
    });
  }

  start_simulation(): void {
    var first_tachyon: Tachyon = new Tachyon(this.emitter_pos, new Vector2(0, 1), this, 1);
    this.add_tachyon_to_tachyon_instances(first_tachyon);

    while (first_tachyon.is_within_map_bounds()) {
      this.tachyon_instances.forEach((this_tach: Tachyon) => {
        this_tach.step();
      })
    }
  }

  // Note if we fall out of bounds, we return a X!
  get_position_symbol(x: number, y: number): string {
    if (x < 0 || y < 0 || x > this.max_x || y > this.max_y) {
      return "X"
    }

    return this.grid[y][x];
  }

  get_number_of_splits(): number {
    var counts_of_splits: number = 0;
    this.grid.forEach((y_str_array: Array<string>, y_pos: number) => {
      y_str_array.forEach((str_symbol: string, x_pos: number) => {
        if (str_symbol == "^" && this.get_position_symbol(x_pos, y_pos - 1) == "|") {
          counts_of_splits += 1;
        }
      });
    });
    return counts_of_splits;
  }

  get_tachyon_at_position(position: Vector2): Tachyon | null {
    var found_tachyon: Tachyon | null = null;
    this.tachyon_instances.every((this_tachyon: Tachyon) => {
      if (this_tachyon.position.is_equal(position)) {
        found_tachyon = this_tachyon;
        return false;
      }
      return true;
    });
    return found_tachyon;
  }

  // Useful for creating a trail
  set_symbol(x: number, y: number, symbol: string): void {
    this.grid[y][x] = symbol;
  }

  // HACK:: Extremely shite obj manager that should not be used for anything other than this specific application
  add_tachyon_to_tachyon_instances(tachyon: Tachyon): void {
    this.tachyon_instances.push(tachyon);
  }
}

// A Tachyon will be its own individual object
class Tachyon {
  position: Vector2;
  velocity: Vector2;
  reference_map: MapGrid;
  intensity: number;

  constructor(position: Vector2, velocity: Vector2, reference_map: MapGrid, intensity: number) {
    this.position = new Vector2(position.x_pos, position.y_pos);
    this.velocity = new Vector2(velocity.x_pos, velocity.y_pos);
    this.reference_map = reference_map; // NOTE: How do references behave with JS???
    this.intensity = intensity;
  }

  // super useful!
  step(): void {
    this.create_map_trail();
    this.position.add_vector(this.velocity);
    this.try_clone();
  }

  is_within_map_bounds(): boolean {
    var sym_gotten: string = this.reference_map.get_position_symbol(this.position.x_pos, this.position.y_pos)
    if (sym_gotten == "X") {
      return false;
    } else {
      return true;
    }
  }

  try_clone(): boolean {
    if (this.reference_map.get_position_symbol(this.position.x_pos, this.position.y_pos) == "^") {
      var attempt_clone_position: Vector2 = new Vector2(this.position.x_pos - 1, this.position.y_pos)
      var tachyon_at_position: Tachyon | null = this.reference_map.get_tachyon_at_position(attempt_clone_position)
      if (tachyon_at_position === null) {
        var new_tachyon = new Tachyon(attempt_clone_position, new Vector2(0, 1), this.reference_map, this.intensity)
        this.reference_map.add_tachyon_to_tachyon_instances(new_tachyon)
      } else if (tachyon_at_position instanceof Tachyon) {
        tachyon_at_position.intensity += this.intensity;
      }

      this.position.add_vector(new Vector2(+1, 0))
      return true;
    } else {
      return false;
    }
  }

  create_map_trail(): void {
    if (this.reference_map.get_position_symbol(this.position.x_pos, this.position.y_pos) == ".") {
      this.reference_map.set_symbol(this.position.x_pos, this.position.y_pos, "|");
    }
  }
}


export function day_seven_part_one_and_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_7/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  var this_map: MapGrid = new MapGrid(split_text);
  this_map.start_simulation();
  console.log("Part 1 answer:", this_map.get_number_of_splits())

  const initial_value: number = 0;
  const tachyon_intensities: Array<number> = this_map.tachyon_instances.map((this_tachyon: Tachyon) => { return this_tachyon.intensity })
  const sum: number = tachyon_intensities.reduce(
    (accumulator, initial_value) => accumulator + initial_value,
    initial_value,
  );

  console.log("Part 2 answer:", sum)

  return 0;
}
