#! /bin/sh

i=`ls | grep yml`
rm output.txt
touch output.txt
for j in $i
  do echo $j '>> output.txt'
     echo '------------ '$j' ------------' >> output.txt
     artillery run $j >> output.txt
     echo '\n\n\n' >> output.txt
done

echo 'Done!'
