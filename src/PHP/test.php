<?php

function replace(string $s): string {
  $vowel = ['o', 'O', 'u', 'U', 'a', 'A', 'e', 'E', 'i', 'I'];
  $strArr = str_split($s);
  $finalStr = '';
  for($i = 0 ; $i < count($strArr) ; $i++) {
    for($j = 0 ; $j < count($vowel) ; $j++) {
      if ($j === 9 && $vowel[$j] !== $strArr[$i]) {
        $finalStr.=$strArr[$i];
        break;
      } else if ($vowel[$j] === $strArr[$i]) {
        $finalStr.='!';
        break;
      }
    }
  }
  return $finalStr;
}

echo replace('auioe');
