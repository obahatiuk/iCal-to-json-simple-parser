using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Services
{
    public class Parser
    {
        string[] lines;

        List<int[]> indexes;

        public Parser(string content)
        {
            lines = content.Split('\n');
            lines = ConcatMultiLine(lines);
            var result = MapBegginAndEndIndexes(lines);
        }

        string[] ConcatMultiLine(string[] lines)
        {
            var linesList = lines.ToList();
            var linesWithoutComponentName = lines.Where(l => !l.Contains(':')).ToArray();
            if (linesWithoutComponentName.Length != 0)
            {
                foreach (var line in linesWithoutComponentName)
                {
                    var index = linesList.IndexOf(line);
                    if (line.Contains(';'))
                    {
                        linesList[index + 1] = linesList[index] + Regex.Replace(linesList[index + 1], @"\t|\n|\r", "");
                    }
                    else
                    {
                        linesList[index - 1] = linesList[index - 1] + Regex.Replace(linesList[index], @"\t|\n|\r", "");
                    }
                    linesList.RemoveAt(index);
                }
            }
            return linesList.ToArray();
        }

        List<int[]> MapBegginAndEndIndexes(string[] lines)
        {
            var begginNodeIndexes = FindBeggingOfTheNodes(lines);

            indexes = new List<int[]>();

            foreach (var begginNodeIndex in begginNodeIndexes)
            {
                var nodeName = lines[begginNodeIndex].Split(':')[1];
                var valuesArray = lines.Skip(begginNodeIndex).ToArray();
                var endIndex = valuesArray.Where(l => l.Contains("END:" + nodeName)).Select(l => Array.IndexOf(valuesArray, l)).FirstOrDefault();

                indexes.Add(new int[] { begginNodeIndex, endIndex + begginNodeIndex });
            }

            return indexes;
        }

        int[] FindBeggingOfTheNodes(string[] lines)
        {
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

        public ExpandoObject ParseCalendar()
        {
            var result = new ExpandoObject();
            ParseLinesToObject(indexes[0][0], indexes[0][1], ref result);

            return result;
        }

        void ParseLinesToObject(int startIndex, int endIndex, ref ExpandoObject parentElement)
        {
            var tempParentObject = parentElement as IDictionary<string, object>;
            object myLock = new object();

            var tempObject = new ExpandoObject() as IDictionary<string, object>;

            var currentLevelNodeName = lines[startIndex].Split(':')[1];

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
                var componentObject = new ExpandoObject() as IDictionary<string, object>;
                var componentName = "";
                var value = "";

                var colonLineSplit = line.Split(':');

                if (colonLineSplit.Length != 2)
                    throw (new Exception());

                if (line.Contains(';'))
                {
                    var semicolonLineSplit = colonLineSplit[0].Split(';');
                    componentName = semicolonLineSplit[0];

                    if (semicolonLineSplit.Length < 2)
                        throw (new Exception());

                    var equalitySignLineSplit = semicolonLineSplit[1].Split('=');

                    if (equalitySignLineSplit.Length % 2 != 0)
                        throw (new Exception());

                    for (var i = 0; i < equalitySignLineSplit.Length; i += 2)
                    {
                        componentObject.Add(equalitySignLineSplit[i], equalitySignLineSplit[i + 1]);
                    }
                    value = colonLineSplit[1];

                }
                else
                {
                    componentName = colonLineSplit[0];
                    value = colonLineSplit[1];
                }
                componentObject.Add("VALUE", value);
                tempObject.Add(componentName, (ExpandoObject)componentObject);
            }

            foreach (var objectsElements in childrenNodesLinesIndexes)
            {
                var tempObjectAsObject = (ExpandoObject)tempObject;
                ParseLinesToObject(objectsElements[0], objectsElements[1], ref tempObjectAsObject);
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
