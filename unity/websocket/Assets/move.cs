using UnityEngine;
using System.Collections;

public class move : MonoBehaviour {

	public float offset = 1;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		transform.position += new Vector3 (Mathf.Sin (Time.deltaTime* offset) * 1, 0, 0);
	}
}
