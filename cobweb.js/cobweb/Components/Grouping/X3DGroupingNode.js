
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
],
function ($,
          X3DChildNode, 
          X3DBoundedObject, 
          TraverseType,
          X3DConstants,
          Box3)
{
	function remove (array, first, last, range, rfirst, rlast, getId)
	{
		if (! getId)
			getId = remove .getId ;

		var set = { };

		for (var i = rfirst; i < rlast; ++ i)
			set [getId (range [i])] = true;

		return remove_impl (array, first, last, set, getId);
	}

	function remove_impl (array, first, last, set, getId)
	{
		if ($.isEmptyObject (set))
			return last;

		var count = 0;

		for (; first !== last; ++ first)
		{
			if (set [getId (array [first])])
			{
				++ count;
				break;
			}
		}

		LOOP:
		for (; ;)
		{
			var second = first + count;

			for (; second !== last; ++ first, ++ second)
			{
				if (set [getId (array [second])])
				{
					++ count;
					continue LOOP;
				}

				array [first] = array [second];
			}

			break;
		}

		for (var second = first + count; second !== last; ++ first, ++ second)
		{
			array [first] = array [second];
		}

		return first;
	}

	remove .getId = function (value) { return value; };

	//

	function getId (value) { return value ? value .getId () : -1; };
	function getNodeId (value) { return value ? value .getValue () .getId () : -1; }

	function X3DGroupingNode (browser, executionContext)
	{
		X3DChildNode     .call (this, browser, executionContext);
		X3DBoundedObject .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DGroupingNode);
	               
		this .hidden                = false;
		this .visible               = [ ];
		this .pointingDeviceSensors = [ ];
		this .cameraObjects         = [ ];
		this .localFogs             = [ ];
		this .clipPlanes            = [ ];
		this .childNodes            = [ ];
	}

	X3DGroupingNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DBoundedObject .prototype,
	{
		constructor: X3DGroupingNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);

			this .addChildren_    .addInterest (this, "set_addChildren__");
			this .removeChildren_ .addInterest (this, "set_removeChildren__");
			this .children_       .addInterest (this, "set_children__");

			this .set_children__ ();
		},
		getBBox: function ()
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
				return X3DBoundedObject .getBBox (this .children_);

			return new Box3 (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
		},
		setHidden: function (value)
		{
			if (value !== this .hidden)
			{
				this .hidden = value;

				this .set_children__ ();
			}
		},
		setVisible: function (value)
		{
			this .visible = value;

			this .set_children__ ();
		},
		getChild: function (index)
		{
			// Used in LOD and Switch.
			
			try
			{
				if (index >= 0 && index < this .children_ .length)
				{
					var child = this .children_ [index];

					if (child)
						return child .getValue () .getInnerNode ();
				}
			}
			catch (error)
			{ }

			return null;
		},
		set_addChildren__: function ()
		{
			if (this .addChildren_ .length === 0)
				return;

			this .addChildren_ .setTainted (true);
			this .addChildren_ .erase (remove (this .addChildren_, 0, this .addChildren_ .length,
			                                   this .children_,    0, this .children_    .length,
			                                   getNodeId),
			                           this .addChildren_ .length);

			if (! this .children_ .getTainted ())
			{
				this .children_ .removeInterest (this, "set_children__");
				this .children_ .addInterest (this, "connectChildren");
			}

			this .children_ .insert (this .children_ .length, this .addChildren_, 0, this .addChildren_ .length);
			this .add (this .addChildren_);

			this .addChildren_ .set ([ ]);
			this .addChildren_ .setTainted (false);
		},
		set_removeChildren__: function ()
		{
			if (this .removeChildren_ .length === 0)
				return;

			if (this .children_ .length === 0)
				return;

			var innerNodes = [ ];

			for (var i = 0, length = this .removeChildren_ .length; i < length; ++ i)
			{
				try
				{
					var node = this .removeChildren_ [i];

					if (node)
						innerNodes .push (node .getValue () .getInnerNode ());
				}
				catch (error)
				{ }
			}

			for (var i = 0, length = innerNodes .length; i < length; ++ i)
				innerNodes [i] .isCameraObject_ .removeInterest (this, "set_cameraObjects__");

			if (this .localFogs .length)
			{
				this .localFogs .splice (remove (this .localFogs, 0, this .localFogs .length,
				                                 innerNodes, 0, innerNodes .length,
				                                 getId));
			}

			if (this .pointingDeviceSensors .length)
			{
				this .pointingDeviceSensors .splice (remove (this .pointingDeviceSensors, 0, this .pointingDeviceSensors .length,
				                                             innerNodes, 0, innerNodes .length,
				                                             getId));
			}

			if (this .clipPlanes .length)
			{
				this .clipPlanes .splice (remove (this .clipPlanes, 0, this .clipPlanes .length,
				                                  innerNodes, 0, innerNodes .length,
				                                  getId));
			}

			if (this .childNodes .length)
			{
				this .childNodes .splice (remove (this .childNodes, 0, this .childNodes .length,
				                                  innerNodes, 0, innerNodes .length,
				                                  getId));
			}

			if (! this .children_ .getTainted ())
			{
				this .children_ .removeInterest (this, "set_children__");
				this .children_ .addInterest (this, "connectChildren");
			}

			this .children_ .erase (remove (this .children_,       0, this .children_ .length,
			                                this .removeChildren_, 0, this .removeChildren_ .length,
			                                getNodeId),
			                        this .children_ .length);

			this .removeChildren_ .set ([ ]);
		},
		set_children__: function ()
		{
			this .clear ();
			this .add (this .children_);
		},
		connectChildren: function ()
		{
			this .children_ .removeInterest (this, "connectChildren");
			this .children_ .addInterest (this, "set_children__");
		},
		add: function (children)
		{
			if (this .hidden)
				return;

			for (var i = 0, length = children .length; i < length; ++ i)
			{
				var child = children [i];
			
				if (child && (i >= this .visible .length || this .visible [i] .getValue ()))
				{
					try
					{
						var
							innerNode = child .getValue () .getInnerNode (),
							type      = Array .prototype .slice .call (innerNode .getType (), 0) .reverse ();

						for (var t = 0; t < type .length; ++ t)
						{
							switch (type [t])
							{
								case X3DConstants .X3DPointingDeviceSensorNode:
								{
									this .pointingDeviceSensors .push (innerNode);
									break;
								}
								case X3DConstants .LocalFog:
								{
									this .localFogs .push (innerNode);
									break;
								}
								case X3DConstants .ClipPlane:
								{
									this .clipPlanes .push (innerNode);
									break;
								}
								//case X3DConstants .Fog:
								//case X3DConstants .NavigationInfo:
								//case X3DConstants .X3DViewpointNode:
								   // Only camera objects, maybe we can optimize these away.
								case X3DConstants .X3DChildNode:
								{
									this .childNodes .push (innerNode);

									innerNode .isCameraObject_ .addInterest (this, "set_cameraObjects__");
									break;
								}
								case X3DConstants .BooleanFilter:
								case X3DConstants .BooleanToggle:
								case X3DConstants .NurbsOrientationInterpolator:
								case X3DConstants .NurbsPositionInterpolator:
								case X3DConstants .NurbsSurfaceInterpolator:
								case X3DConstants .TimeSensor:
								case X3DConstants .X3DFollowerNode:
								case X3DConstants .X3DInfoNode:
								case X3DConstants .X3DInterpolatorNode:
								case X3DConstants .X3DLayoutNode:
								case X3DConstants .X3DScriptNode:
								case X3DConstants .X3DSequencerNode:
								case X3DConstants .X3DTriggerNode:
									break;
								default:
									continue;
							}

							break;
						}
					}
					catch (error)
					{ }
				}
			}

			this .set_cameraObjects__ ();
		},
		clear: function ()
		{
			this .pointingDeviceSensors .length = 0;
			this .cameraObjects         .length = 0;
			this .localFogs             .length = 0;
			this .clipPlanes            .length = 0;
			this .childNodes            .length = 0;
		},
		set_cameraObjects__: function ()
		{
			this .cameraObjects .length = 0;

			for (var i = 0, length = this .childNodes .length; i < length; ++ i)
			{
				var childNode = this .childNodes [i];

				if (childNode .getCameraObject ())
					this .cameraObjects .push (childNode);
			}

			this .setCameraObject (this .cameraObjects .length);
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .POINTER:
				{
					if (this .pointingDeviceSensors .length)
					{
						var sensors = { };
						
						this .getBrowser () .getSensors () .push (sensors);
					
						for (var i = 0, length = this .pointingDeviceSensors .length; i < length; ++ i)
							this .pointingDeviceSensors [i] .traverse (sensors);
					}

					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .push ();

					for (var i = 0, length = this .childNodes .length; i < length; ++ i)
						this .childNodes [i] .traverse (type);

					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .pop ();

					if (this .pointingDeviceSensors .length)
						this .getBrowser () .getSensors () .pop ();

					return;
				}
				case TraverseType .CAMERA:
				{
					for (var i = 0, length = this .cameraObjects .length; i < length; ++ i)
						this .cameraObjects [i] .traverse (type);

					return;
				}
				case TraverseType .COLLISION:
				{					
					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .push ();

					for (var i = 0, length = this .childNodes .length; i < length; ++ i)
						this .childNodes [i] .traverse (type);

					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .pop ();
					
					return;
				}
				case TraverseType .DISPLAY:
				{
					for (var i = 0, length = this .localFogs .length; i < length; ++ i)
						this .localFogs [i] .push ();

					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .push ();

					for (var i = 0, length = this .childNodes .length; i < length; ++ i)
						this .childNodes [i] .traverse (type);

					for (var i = 0, length = this .clipPlanes .length; i < length; ++ i)
						this .clipPlanes [i] .pop ();
					
					for (var i = 0, length = this .localFogs .length; i < length; ++ i)
						this .localFogs [i] .pop ();
					
					return;
				}
			}
		},
	});

	return X3DGroupingNode;
});

