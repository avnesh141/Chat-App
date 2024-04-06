
 export function DateDiff(date) {
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);
  let hours = date.slice(11, 13);
  let minutes = date.slice(14, 16);
  let seconds = date.slice(17, 19);
  let time = new Date();
  // console.log(time);
  let curryear = time.getFullYear();
  let currmonth = time.getMonth() + 1;
  let currday = time.getDate();
  let currhours = time.getHours();
  let currminutes = time.getMinutes();
  let currseconds = time.getSeconds();
  // console.log(time.getMonth(), month, currhours, currminutes, currseconds);
  // console.log(year);
  let ans = "";
  if (curryear - year > 1) {
    ans = "Very long ago";
  }
  else if (curryear == year && currmonth == month) {
    if (currday - day == 1) {
      ans = "Yesterday";
    }
    else if (currday == day) {
      ans = "Today";
    }
    else {
      ans = date.slice(0, 10);
    }
  }
  else if (curryear - year == 1) {
    ans = "1 Year ago";
  }
  else {
    ans = date.slice(0, 10);
  }
  // console.log(ans);
  return ans;
}