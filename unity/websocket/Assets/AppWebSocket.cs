using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using WebSocketSharp;
using MiniJSON;
using System;


public class AppWebSocket : MonoBehaviour {

	public string address;

	public Action<int, int, string> ReceivePacketAction;
		
	Queue<string> m_tmpQueue = new Queue<string>();

	private List<string> m_receiveDataList = new List<string>();
	
	WebSocket m_webSocket;
	private bool m_IsConnect = false;

	private Vector3 tmp_p,tmp_r  = Vector3.zero;

	public Vector3 pos,angles = Vector3.zero;

	public bool send_mode = true;
	public bool	read_mode = false;

	public string obj_id;

	private void Connect(){
		m_webSocket = new WebSocket(address);
		m_webSocket.OnOpen += (sender, e) =>
		{
			Debug.Log("m_webSocket.OnOpen");
			m_IsConnect = true;
			ReceivePacketAction += ReceivedMessage;
		};

		m_webSocket.OnMessage += (sender, e) =>
		{
			string message = e.Data;

			readJson(message);
			Debug.Log(string.Format("OnMessage:", message));
			m_tmpQueue.Enqueue(message);
		};

		m_webSocket.OnClose += (sender, e) =>
		{
			Debug.Log(string.Format("OnClosed {0}", e.Reason));
			m_IsConnect = false;
		};
		
		m_webSocket.Connect();
	}

	private void Close()
	{
		ReceivePacketAction = null;
		m_tmpQueue.Clear();
		m_webSocket.Close();
	}

	void Send(string stream)
	{
		//stream = "{ID:" + gameObject.name + "\"x\": " + transform.position.x + " , \"y\": " + transform.position.y + " , \"z\":"+ transform.position.z + "}";
		
		//Debug.Log("send data. stream=" + stream);
		m_webSocket.Send(stream);
	}

	enum Type
	{
		REGISTER = 1,
		SEND_DATA = 2,
	}
	
	void ReceiveData(string receivePackets)
	{
		if (receivePackets != null && receivePackets.Length != 0)
		{
			foreach (string stream in receivePackets.Split('|'))
			{
				int id = 0;
				int type = 0;
				ReceivePacketAction(type, id, stream);
			}
		}
	}

	void ReceivedMessage(int type, int id, string jsonData)
	{
		//Debug.Log("Received jsonData=" + jsonData);		
		m_receiveDataList.Add(jsonData);
		if(m_receiveDataList.Count > 5)
			m_receiveDataList.RemoveAt(0);

		readJson(jsonData);
	}

	void readJson(string data){
		var jsonData = MiniJSON.Json.Deserialize(data) as Dictionary<string,object>;
		if(jsonData != null){
			//Debug.Log("ID:"+jsonData["ID"]+" type:"+jsonData["type"]);
			if(jsonData["type"].ToString() == "transfome"){
				if(jsonData["ID"].ToString() == obj_id){
					pos    = new Vector3(float.Parse(jsonData["x_p"].ToString()),float.Parse(jsonData["y_p"].ToString()),float.Parse(jsonData["z_p"].ToString()));
					angles = new Vector3(float.Parse(jsonData["x_r"].ToString()),float.Parse(jsonData["y_r"].ToString()),float.Parse(jsonData["z_r"].ToString()));
					//tmp_p = pos;
					//tmp_r = angles;
				}
			}
		}else{
			Debug.Log("Not Json");
		}
	}

	void Awake () {
		Connect();
	}
	
	void Start(){
		obj_id = gameObject.name;
		tmp_p = transform.position;
		tmp_r = transform.eulerAngles;
	}

	void Update () {
		if ((transform.position != tmp_p || transform.eulerAngles != tmp_r) && send_mode) {
			//Debug.Log("SEND MODE");
			tmp_p = transform.position;
			tmp_r = transform.eulerAngles;
			Send("{" +
			     	"\"ID\":" + "\"" + obj_id + "\"" +
			     	" , \"type\":" + "\"transfome\"" + 
				    " , \"x_p\":" + transform.position.x + 
				    " , \"y_p\":" + transform.position.y + 
				    " , \"z_p\":"+  transform.position.z + 
			     	" , \"x_r\":" + transform.eulerAngles.x + 
			     	" , \"y_r\":" + transform.eulerAngles.y + 
			     	" , \"z_r\":"+  transform.eulerAngles.z + 
			     "}");
		}
		if(read_mode){
			//Debug.Log("READ MODE");
			transform.position = pos + new Vector3(10,0,0);
			transform.eulerAngles = angles;
		}
	}
	
	void OnApplicationQuit() {
		Close();
		Debug.Log("exit");
	}

}
