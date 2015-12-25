
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/EnvironmentalSensor/ProximitySensor",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode,
          ProximitySensor,
          TraverseType,
          X3DConstants,
          Vector3)
{
"use strict";

	function ViewpointGroup (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ViewpointGroup);
	   
		this .proximitySensor  = new ProximitySensor (executionContext);
		this .cameraObjects    = [ ];
		this .viewpointGroups  = [ ];
	}

	ViewpointGroup .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: ViewpointGroup,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "displayed",         new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "size",              new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "center",            new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "children",          new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "ViewpointGroup";
		},
		getComponentName: function ()
		{
			return "Navigation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);
		   
			this .proximitySensor .setup ();

			this .size_   .addFieldInterest (this .proximitySensor .size_);
			this .center_ .addFieldInterest (this .proximitySensor .center_);

			this .proximitySensor .size_   = this .size_;
			this .proximitySensor .center_ = this .center_;

			this .displayed_ .addInterest (this, "set_displayed__");
			this .size_      .addInterest (this, "set_displayed__");
			this .children_  .addInterest (this, "set_children__");

			this .set_displayed__ ();
			this .set_children__ ();
		},
		isActive: function ()
		{
		   return this .proximitySensor .isActive_ .getValue ();
		},
		set_displayed__: function ()
		{
			var
				proxy     = ! this .size_ .getValue () .equals (Vector3 .Zero),
				displayed = this .displayed_ .getValue ();

			this .proximitySensor .enabled_ = displayed && proxy;

			if (displayed && proxy)
			{
				this .proximitySensor .isCameraObject_ .addFieldInterest (this .isCameraObject_);
				this .setCameraObject (this .proximitySensor .getCameraObject ());
				this .traverse = traverseWithProximitySensor;
			}
			else
			{
				this .proximitySensor .isCameraObject_ .removeFieldInterest (this .isCameraObject_);
				this .setCameraObject (displayed);

				if (displayed)
					this .traverse = traverse;
				else
					delete this .traverse;
			}
		},
		set_children__: function ()
		{
			this .cameraObjects   .length = 0;
			this .viewpointGroups .length = 0;

			var children = this .children_;

			for (var i = 0, length = children .length; i < length; ++ i)
			{
				try
				{
					var
						innerNode = children [i] .getValue () .getInnerNode (),
						type      = innerNode .getType ();

					for (var t = type .length - 1; t >= 0; -- t)
					{
						switch (type [t])
						{
							case X3DConstants .X3DViewpointNode:
							{
								this .cameraObjects .push (innerNode);
								break;
							}
							case X3DConstants .ViewpointGroup:
							{
								this .cameraObjects   .push (innerNode);
								this .viewpointGroups .push (innerNode);
								break;
							}
						}
					}
				}
				catch (error)
				{ }
			}
		},
		traverse: function () { },
	});

	function traverseWithProximitySensor (type)
	{
		switch (type)
		{
			case TraverseType .CAMERA:
			{
				this .proximitySensor .traverse (type);
		
				if (this .proximitySensor .isActive_ .getValue ())
				{
					for (var i = 0, length = this .cameraObjects .length; i < length; ++ i)
						this .cameraObjects [i] .traverse (type);
				}

				return;
			}
			case TraverseType .DISPLAY:
			{
				this .proximitySensor .traverse (type);
		
				if (this .proximitySensor .isActive_ .getValue ())
				{
					for (var i = 0, length = this .viewpointGroups .length; i < length; ++ i)
						this .viewpointGroups [i] .traverse (type);
				}

				return;
			}
		}
	}

	function traverse (type)
	{
		switch (type)
		{
			case TraverseType .CAMERA:
			{
				for (var i = 0, length = this .cameraObjects .length; i < length; ++ i)
					this .cameraObjects [i] .traverse (type);

				return;
			}
			case TraverseType .DISPLAY:
			{
				for (var i = 0, length = this .viewpointGroups .length; i < length; ++ i)
					this .viewpointGroups [i] .traverse (type);

				return;
			}
		}
	}

	return ViewpointGroup;
});


