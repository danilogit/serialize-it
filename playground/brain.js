const brain = require('brain.js');

const str1 = "public class ReadXmlNfe extends ReadXmlFile<XmlNfe> {";
const strEx1 = "public class ReadXmlNfe extends ReadXmlFile<XmlNfe>, Teste implements Serializable {"
const str1N = str1.split('').map(item => item.charCodeAt(0))
const strEx1N = str1.split('').map(item => item.charCodeAt(0))


const str2 = "public class VersaoTerminologiaAcaoType {";
const strEx2 = "public class VersaoTerminologiaAcaoType implements Serializable {"
const str2N = str1.split('').map(item => item.charCodeAt(0))
const strEx2N = str1.split('').map(item => item.charCodeAt(0))

const str3 = "public class VersaoTerminologiaAcaoType {";
const str3N = str1.split('').map(item => item.charCodeAt(0))

const trainingData = [
  {input: str1N, output: strEx1N},
  {input: str2N, output: strEx2N},
];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(trainingData, { iterations: 100 });
const run1 = lstm.run(str3N);

console.log('run 1:',run1);
