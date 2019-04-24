using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;

namespace iCalApp
{
    public class Parser
    {

        string[] lines;
        //int[] begginNodeIndexes;
        //int[] endNodeIndexes;
        List<int[]> indexes;

        public Parser(string content) {
            lines = content.Split("\n");
            var result = mapBegginAndEndIndexes(lines);

            parseCalendar();
        }

        List<int[]> mapBegginAndEndIndexes(string[] lines) {
            var begginNodeIndexes = FindBeggingOfTheNodes(lines);

            indexes = new List<int[]>();//List<int[]> 

            foreach (var begginNodeIndex in begginNodeIndexes)
            {
                var nodeName = lines[begginNodeIndex].Split(':')[1];
                var valuesArray = lines.Skip(begginNodeIndex).ToArray();
                var endIndex = valuesArray.Where(l => l.Contains("END:"+nodeName)).Select(l => Array.IndexOf(valuesArray, l)).FirstOrDefault();

                indexes.Add(new int[] { begginNodeIndex, endIndex + begginNodeIndex });
            }
            
            return indexes;
        }

        int[] FindBeggingOfTheNodes(string[] lines)  {
            return FindLineIndexesWithWordOccurancies(lines, "BEGIN").ToArray();
        }

        void parseCalendar()
        {
            var result = parseLinesToObject(indexes[0][0], indexes[0][1]);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(result);
            Console.WriteLine(json);
        }

        ExpandoObject parseLinesToObject(int startIndex, int endIndex)//string[] lines
        {

            var lineIndexesToSkip = new List<int[]>();

            var tempObject = new ExpandoObject() as IDictionary<string, Object>; 

            var isObjectContainsOtherObjects = indexes.Where(i => i[0] > startIndex + 1 && i[1] < endIndex + 1).FirstOrDefault() != null;

            if (isObjectContainsOtherObjects)
            {
                var childrenObjectIndexes = indexes.Where(i => i[0] > startIndex + 1 && i[1] < endIndex + 1).ToArray();

                lineIndexesToSkip = childrenObjectIndexes.ToList();

                var objectArrayNames = childrenObjectIndexes.Select(i => lines[i[0]].Split(":")[1]);//.Distinct();

                var lists = new Dictionary<string, List<Object>> ();

                foreach (var arrayName in objectArrayNames)
                {
                    if (!lists.Keys.Contains(arrayName))
                        lists.Add(arrayName, new List<Object>());
                }

                foreach (var objectsElements in childrenObjectIndexes)
                {
                    var childObject = parseLinesToObject(objectsElements[0], objectsElements[1]);
                    var relatedArrayName = lines[objectsElements[0]].Split(":")[1];
                    lists[relatedArrayName].Add(childObject);
                }

                foreach (var list in lists)
                {
                    tempObject.Add(list.Key, list.Value);
                }
            }

            string[] subArray = new string[endIndex - 1 - startIndex];
            Array.Copy(lines, startIndex + 1, subArray, 0, endIndex - 1 - startIndex);

            var listOfLines = subArray.ToList();

            var numberOfLinesRemoved = 0;

            if (lineIndexesToSkip.Count != 0)
            {


                for(int j = 0; j < lineIndexesToSkip.Count; j++)
                {

                    var indexesToBeDeleted = lineIndexesToSkip.Where(i => i[0] > lineIndexesToSkip[j][0] && i[1] < lineIndexesToSkip[j][1]).ToArray();
                    if (indexesToBeDeleted.Length != 0)
                    {
                        foreach (var index in indexesToBeDeleted)
                        {
                            lineIndexesToSkip.Remove(index);
                        }
                    }
                }
                foreach (var skipIndex in lineIndexesToSkip)
                {

                    listOfLines.RemoveRange(skipIndex[0] - 1 - startIndex - numberOfLinesRemoved, skipIndex[1] + 1 - skipIndex[0]);
                    numberOfLinesRemoved = skipIndex[1] + 1 - skipIndex[0];
                }
            }

            foreach (var line in listOfLines)
            {
                var lineSplit = line.Split(':');
                tempObject.Add(lineSplit[0], lineSplit[1]);
            }
            return tempObject as ExpandoObject;
        }

        Dictionary<string, string> parseLinesToArray(string[] lines)
        {
            var tempObject = new Dictionary<string, string>();
            foreach (var line in lines)
            {
                var lineSplit = line.Split(':');
                tempObject.Add(lineSplit[0], lineSplit[1]);
            }
            return tempObject;
        }

        List<int> FindLineIndexesWithWordOccurancies(string[] lines, string word) {
            var linesWithOccurancies = FindLineWithWordOccurancies(lines, word);
            int previuosIndex = 0;
            var result = new List<int>();
            foreach (var line in linesWithOccurancies)
            {
                var index = Array.IndexOf(lines, line, previuosIndex);
                previuosIndex = index + 1;
                result.Add(index);
            }
            return result;
        }

        string[] FindLineWithWordOccurancies(string[] lines, string word) {
            return lines.Where(l => l.ToLower().Contains(word.ToLower())).ToArray();
        }
    }
}
