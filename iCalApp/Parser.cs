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

        List<int[]> indexes;

        public Parser(string content) {
            lines = content.Split("\n");
            var result = mapBegginAndEndIndexes(lines);

            parseCalendar();
        }

        List<int[]> mapBegginAndEndIndexes(string[] lines) {
            var begginNodeIndexes = FindBeggingOfTheNodes(lines);

            indexes = new List<int[]>();

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

        List<int> FindLineIndexesWithWordOccurancies(string[] lines, string word)
        {
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

        string[] FindLineWithWordOccurancies(string[] lines, string word)
        {
            return lines.Where(l => l.ToLower().Contains(word.ToLower())).ToArray();
        }

        void parseCalendar()
        {
            var result = new ExpandoObject();
            parseLinesToObject(indexes[0][0], indexes[0][1], ref result);
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(result);
            Console.WriteLine(json);
        }

        void parseLinesToObject(int startIndex, int endIndex, ref ExpandoObject parentElement)
        {
            var tempParentObject = parentElement as IDictionary<string, object>;
            object myLock = new object();

            var tempObject = new ExpandoObject() as IDictionary<string, object>;

            var currentLevelNodeName = lines[startIndex].Split(":")[1];

            var childrenObjectIndexes = indexes.Where(i => i[0] > startIndex + 1 && i[1] < endIndex + 1).ToArray();

            var childrenNodesLinesIndexes = childrenObjectIndexes.ToList();

            string[] subArray = new string[endIndex - 1 - startIndex];
            Array.Copy(lines, startIndex + 1, subArray, 0, endIndex - 1 - startIndex);

            var listOfLines = subArray.ToList();

            var numberOfLinesRemoved = 0;

            if (childrenNodesLinesIndexes.Count != 0)
            {


                for (int j = 0; j < childrenNodesLinesIndexes.Count; j++)
                {

                    var indexesToBeDeleted = childrenNodesLinesIndexes.Where(i => i[0] > childrenNodesLinesIndexes[j][0] && i[1] < childrenNodesLinesIndexes[j][1]).ToArray();
                    if (indexesToBeDeleted.Length != 0)
                    {
                        foreach (var index in indexesToBeDeleted)
                        {
                            childrenNodesLinesIndexes.Remove(index);
                        }
                    }
                }
                foreach (var skipIndex in childrenNodesLinesIndexes)
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

            foreach (var objectsElements in childrenNodesLinesIndexes)
            {
                var tempObjectAsObject = (ExpandoObject)tempObject;
                parseLinesToObject(objectsElements[0], objectsElements[1], ref tempObjectAsObject);
            }

            if (!tempParentObject.Keys.Contains(currentLevelNodeName))
            {
                tempParentObject.Add(currentLevelNodeName, new List<object>() { tempObject as ExpandoObject });
            }
            else
            {
                (tempParentObject[currentLevelNodeName] as List<object>).Add(tempObject as ExpandoObject);
            }
        }
    }
}
