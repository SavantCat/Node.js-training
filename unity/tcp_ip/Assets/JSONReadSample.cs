using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using MiniJSON;


public class JSONReadSample : MonoBehaviour {
	public float x,y,z = 0;
	public Vector3 pos;



	void Update () {
		//仮のJSONテキスト
		//string jsonText = "{\"message\":\"SampleText\","+"\"x\":"+transform.position.x+","+"\"y\":"+transform.position.y+","+"\"z\":"+transform.position.z+"}";
		string jsonText = "hello";
		//JSONテキストのデコード
		var jsonData = MiniJSON.Json.Deserialize(jsonText) as Dictionary<string,object>;
		
		//データの取得
		//string message = (string)jsonData["message"];

		//Debug.Log (float.Parse(jsonData["x"].ToString()));
		//Debug.Log (float.Parse(jsonData["y"].ToString()));
		//Debug.Log (float.Parse(jsonData["z"].ToString()));

		//Debug.Log (jsonData["x"]);

		
		x = float.Parse(jsonData["x"].ToString());
		y = float.Parse(jsonData["y"].ToString());
		z = float.Parse(jsonData["z"].ToString());
		//出力する
		pos = new Vector3(x,y,z);
		
	}
}	