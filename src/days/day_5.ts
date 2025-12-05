import * as fs from 'node:fs';

class IdRangeProcessor {
  id_ranges: Array<string>

  constructor(string_ranges_array: Array<string>) {
    this.id_ranges = string_ranges_array;
  }

  is_within_range(id: number) {
    var within_range: boolean = false;
    this.id_ranges.every((this_string_range: string) => {
      var this_range: Array<number> = this_string_range.split("-").map((str: string) => { return Number(str) })
      var min_range: number = this_range[0]
      var max_range: number = this_range[1]

      if (min_range <= id && id <= max_range) {
        within_range = true;
        return false;
      }

      return true;
    })

    return within_range;
  }
}

export function day_five_part_one() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_5/real_input.txt', 'utf8');
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  var ranges_array: Array<string> = [];
  var ids_array: Array<string> = [];
  var first_set: boolean = true;

  split_text.forEach((this_string: string) => {
    if (this_string == "") {
      first_set = false;
      return;
    }

    if (first_set) {
      ranges_array.push(this_string);
    } else {
      ids_array.push(this_string);
    }
  });

  var this_id_range_processor: IdRangeProcessor = new IdRangeProcessor(ranges_array);

  var fresh_ingredients: number = 0;

  ids_array.forEach((id: string) => {
    if (this_id_range_processor.is_within_range(Number(id))) {
      fresh_ingredients += 1;
    }
  })

  console.log(fresh_ingredients);

  return 0;
}

class IdRangeProcessorExpanded {
  id_ranges: Array<Array<number>>

  constructor(string_ranges_array: Array<string>) {
    this.id_ranges = string_ranges_array.map((this_string: string) => {
      return this_string.split("-").map((str: string) => { return Number(str) });
    })
  }

  // If this returns -1, then it did not find any intersections!
  get_location_within_range(id: number, idx_to_skip: number): number {
    var location: number = 0;
    this.id_ranges.every((this_id_range: Array<number>) => {
      // We want to early break as we dont want to check a range against itself!
      if (location == idx_to_skip) {
        location += 1;
        return true;
      }
      var min_range: number = this_id_range[0]
      var max_range: number = this_id_range[1]

      if (min_range <= id && id <= max_range) {
        return false;
      }

      location += 1;
      return true;
    })

    if (location >= this.id_ranges.length) {
      return -1;
    } else {
      return location;
    }
  }

  // NOTE: WILL AUTOMATICALLY REMOVE THAT RANGE IF FOUND TO BE INVALID!
  check_valid_range(range: Array<number>, idx_range: number): void {
    var min_val: number = range[0]
    var max_val: number = range[1]

    if (min_val > max_val) {
      this.id_ranges.splice(idx_range, 1)
    }
  }

  tally_up_ranges(): number {
    var tally: number = 0;

    this.id_ranges.forEach((range_arr: Array<number>) => {
      tally = tally + (range_arr[1] - range_arr[0] + 1);
    });

    return tally;
  }
}

export function day_five_part_two() {
  // Where text starts
  var text: string = fs.readFileSync('./data/day_5/real_input.txt', 'utf8'); // Sample input 2 expect 14 + 7 + 10 = 31 real ids
  var split_text: Array<string> = text.split("\n");
  split_text.pop(); // REMEMBER TO REMOVE THIS!

  var ranges_array: Array<string> = [];
  var first_set: boolean = true;

  split_text.forEach((this_string: string) => {
    if (this_string == "") {
      first_set = false;
      return;
    }

    if (first_set) {
      ranges_array.push(this_string);
    }
  });

  var this_id_range_processor: IdRangeProcessorExpanded = new IdRangeProcessorExpanded(ranges_array);

  var intersecting_arrays = true;

  // THis will work by finding intersecting arrays 
  // If the min range is found to intersect, we take the max range of that intersecting array and replace the min with that + 1
  // If the max range is found to intersect, we take the min range of that array and replace the max with that min - 1
  // We then check to see if the array is still valid. If not, then we splice it out!

  while (intersecting_arrays) {
    console.log(this_id_range_processor.id_ranges)
    if (this_id_range_processor.id_ranges.length == 0) {
      throw "fuk this should not be HAPPENING AAAA"
    }

    var idx: number = 0;
    this_id_range_processor.id_ranges.every((this_range: Array<number>) => {
      var min_range: number = this_range[0]
      var max_range: number = this_range[1]

      // Test min value first
      var min_location_pos: number = this_id_range_processor.get_location_within_range(min_range, idx);

      if (min_location_pos != -1) {
        intersecting_arrays = true;
        this_range[0] = this_id_range_processor.id_ranges[min_location_pos][1] + 1;
        this_id_range_processor.check_valid_range(this_range, idx)
        return false;
      } else {
        intersecting_arrays = false;
      }

      // Test max value next
      var max_location_pos: number = this_id_range_processor.get_location_within_range(max_range, idx);

      if (max_location_pos != -1) {
        intersecting_arrays = true;
        this_range[1] = this_id_range_processor.id_ranges[max_location_pos][0] - 1;
        this_id_range_processor.check_valid_range(this_range, idx)
        return false;
      } else {
        intersecting_arrays = false;
      }

      idx += 1;
      return true;
    });
  }

  console.log(this_id_range_processor.id_ranges);
  console.log(this_id_range_processor.tally_up_ranges())

  return 0;
}
