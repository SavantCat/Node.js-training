using UnityEngine;
using System.Collections;

public class move_client_2 : MonoBehaviour {

	public client c = null;

	private Vector3 s;
	// Use this for initialization
	void Start () {
		s = transform.position;
	}
	
	// Update is called once per frame
	void Update () {
		transform.position = c.pos + s;
	}
}
